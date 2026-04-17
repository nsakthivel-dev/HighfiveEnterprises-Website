import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { adminDb, adminStorage, firebaseInitialized } from "./firebase";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import { pipeline } from "stream/promises";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Wrapper function to match the expected usage
const getPdfParse = async () => {
  return async (buffer: Buffer) => {
    // pdf-parse is a function that returns a promise
    const data = await pdf(buffer);
    return { text: data.text };
  };
};
// LanceDB is loaded dynamically to avoid crashing in serverless environments (e.g. Vercel)

// Add a helper function to check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!process.env.FIREBASE_PROJECT_ID;
};

// Vector database setup for document embeddings (lazy-loaded)
let vectorDb: any = null;
let documentTable: any = null;
let vectorDbInitialized = false;

async function initializeVectorDb() {
  if (vectorDbInitialized) return;
  vectorDbInitialized = true;

  try {
    const lancedb = await import("@lancedb/lancedb");
    const db = await lancedb.connect("./data/lancedb");
    
    const tables = await db.tableNames();
    if (!tables.includes("documents")) {
      documentTable = await db.createTable("documents", [
        { id: "", document_id: "", text_chunk: "", vector: Array(1536).fill(0) }
      ]);
    } else {
      documentTable = await db.openTable("documents");
    }
    
    vectorDb = db;
    console.log("Vector database initialized successfully");
  } catch (error) {
    console.warn("Vector database not available (expected in serverless):", (error as Error).message);
  }
}

// Initialize Vector database (non-blocking)
initializeVectorDb().catch((error) => {
  console.warn("Vector database initialization failed (non-critical):", (error as Error).message);
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });

  // File upload endpoint - single file
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!firebaseInitialized || !adminStorage) {
        return res.status(503).json({ error: "Firebase storage not configured" });
      }

      const file = req.file;
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const bucket = adminStorage.bucket();
      const blob = bucket.file(filePath);
      
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        }
      });

      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

      return res.status(200).json({ url: publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Server error during upload" });
    }
  });

  // Multiple file upload endpoint
  app.post("/api/upload/multiple", upload.array("files", 10), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedUrls: string[] = [];
      const errors: string[] = [];
      const bucket = adminStorage.bucket();

      // Upload each file
      for (const file of files) {
        try {
          const fileExt = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const blob = bucket.file(filePath);
          await blob.save(file.buffer, {
            contentType: file.mimetype,
          });

          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
          uploadedUrls.push(publicUrl);
        } catch (err) {
          console.error(`Error uploading ${file.originalname}:`, err);
          errors.push(`Error uploading ${file.originalname}`);
        }
      }

      // Return results
      if (uploadedUrls.length === 0) {
        return res.status(500).json({ 
          error: "Failed to upload all files",
          details: errors 
        });
      }

      return res.status(200).json({ 
        urls: uploadedUrls,
        errors: errors.length > 0 ? errors : undefined,
        count: uploadedUrls.length
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      return res.status(500).json({ error: "Server error during upload" });
    }
  });

  // Background document processing function
  async function processDocumentInBackground(documentId: string, buffer: Buffer, url: string) {
    try {
      console.log(`Processing document ${documentId}`);
      
      // Parse PDF to extract text
      const pdfParseFn = await getPdfParse();
      const data = await pdfParseFn(buffer);
      const text = data.text;
      
      // Split text into chunks (simple implementation)
      const chunks = chunkText(text, 1000);
      
      // Generate embeddings for each chunk and store in vector database
      const embeddings = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // In a real implementation, you would use an embedding model like OpenAI's Ada
        // For this example, we'll create mock embeddings
        const mockEmbedding = Array(1536).fill(0).map(() => Math.random());
        
        embeddings.push({
          id: `${documentId}-${i}`,
          document_id: documentId,
          text_chunk: chunk,
          vector: mockEmbedding
        });
      }
      
      // Store embeddings in vector database
      if (documentTable) {
        await documentTable.add(embeddings);
        console.log(`Stored ${embeddings.length} embeddings for document ${documentId}`);
      }
      
      // In a real implementation, you would also update document status in a database
      
      console.log(`Processed ${chunks.length} chunks from document ${documentId}`);
    } catch (error) {
      console.error(`Error processing document ${documentId}:`, error);
    }
  }
  
  // Helper function to split text into chunks
  function chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }

  // Document upload and processing routes
  // Upload a PDF document for RAG processing
  app.post("/api/documents/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check if file is PDF
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      // Generate unique ID for the document
      const documentId = uuidv4();
      const fileName = `${documentId}.pdf`;
      const filePath = `documents/${fileName}`;

      // Upload to Firebase storage
      const bucket = adminStorage.bucket();
      const blob = bucket.file(filePath);
      
      await blob.save(req.file.buffer, {
        contentType: req.file.mimetype,
      });

      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

      // Store document metadata in database
      const documentMetadata = {
        id: documentId,
        name: req.file.originalname,
        url: publicUrl,
        size: req.file.size,
        uploaded_at: new Date().toISOString(),
        status: "processing",
      };

      // In a real implementation, you would store this in a database
      // For now, we'll just return the metadata
      
      // Process the document asynchronously
      processDocumentInBackground(documentId, req.file.buffer, publicUrl);

      return res.status(200).json({ 
        message: "Document uploaded successfully and is being processed",
        document: documentMetadata
      });
    } catch (error) {
      console.error("Document upload error:", error);
      return res.status(500).json({ error: "Server error during document upload" });
    }
  });

  // Get all documents
  app.get("/api/documents", async (_req: Request, res: Response) => {
    try {
      // In a real implementation, you would fetch this from a database
      // For now, we'll return mock data
      const mockDocuments = [
        {
          id: "1",
          name: "company-policy.pdf",
          url: "https://example.com/company-policy.pdf",
          size: 2457600,
          uploaded_at: "2023-06-15T10:30:00Z",
          status: "processed"
        },
        {
          id: "2",
          name: "technical-specs.pdf",
          url: "https://example.com/technical-specs.pdf",
          size: 5242880,
          uploaded_at: "2023-06-10T14:22:00Z",
          status: "processed"
        },
        {
          id: "3",
          name: "project-proposal.pdf",
          url: "https://example.com/project-proposal.pdf",
          size: 1048576,
          uploaded_at: "2023-06-05T09:15:00Z",
          status: "processing"
        }
      ];
      
      return res.status(200).json(mockDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ error: "Server error fetching documents" });
    }
  });

  // RAG Chat route
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Step 1: Search vector database for relevant document chunks
      let context = "";
      let ragResponse = "";
      
      if (documentTable) {
        // In a real implementation, you would:
        // 1. Generate embedding for the query
        // 2. Search the vector database for similar embeddings
        // 3. Retrieve the most relevant text chunks
        
        // For this example, we'll simulate finding relevant context
        context = "Relevant document information would be retrieved here based on semantic similarity search. ";
      }
      
      // Step 2: If context found, use it to generate a response
      if (context) {
        // In a real implementation, you would use an AI model to generate a response
        // based on the context and user query
        ragResponse = `Based on the documents, here's what I found: ${context}`;
        return res.status(200).json({ response: ragResponse, source: "rag" });
      }
      
      // Step 3: If no relevant context found, use Router AI
      // In a real implementation, you would call a router AI model
      const routerAiResponse = "I couldn't find specific information in the documents, but I can help with general questions. ";
      return res.status(200).json({ response: routerAiResponse, source: "router_ai" });
      
      // Step 4: If Router AI fails, fallback to Gemini
      // This would be handled in the client-side or in a more complex implementation
      
    } catch (error) {
      console.error("Chat error:", error);
      return res.status(500).json({ error: "Server error during chat processing" });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // Activity: list, create, delete
  app.get("/api/activity", async (_req: Request, res: Response) => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set FIREBASE_PROJECT_ID environment variable.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const snapshot = await adminDb.collection("activity")
        .orderBy("created_at", "desc")
        .limit(50)
        .get();
      
      const activities = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(activities);
    } catch (err: any) {
      console.error("Unexpected error in /api/activity:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR",
        details: err.message
      });
    }
  });

  app.post("/api/activity", async (req: Request, res: Response) => {
    const { type, title } = req.body || {};
    if (!type || !title) return res.status(400).json({ message: "type and title are required" });
    
    try {
      const docRef = await adminDb.collection("activity").add({
        type,
        title,
        created_at: new Date().toISOString()
      });
      const doc = await docRef.get();
      return res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/activity/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await adminDb.collection("activity").doc(id).delete();
      return res.status(204).end();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // SERVICES CRUD
  app.get("/api/services", async (_req: Request, res: Response) => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set FIREBASE_PROJECT_ID environment variable.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const snapshot = await adminDb.collection("services")
        .orderBy("sort_order", "asc")
        .orderBy("created_at", "desc")
        .get();
      
      const services = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(services);
    } catch (err: any) {
      console.error("Unexpected error in /api/services:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  });

  app.post("/api/services", async (req: Request, res: Response) => {
    const { title, description, features, icon, sort_order, is_active } = req.body || {};
    if (!title) return res.status(400).json({ message: "title is required" });
    
    try {
      const docRef = await adminDb.collection("services").add({
        title,
        description,
        features: features ?? [],
        icon: icon ?? null,
        sort_order: sort_order ?? 0,
        is_active: is_active ?? true,
        created_at: new Date().toISOString()
      });
      const doc = await docRef.get();
      return res.status(201).json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/services/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, features, icon, sort_order, is_active } = req.body || {};
    
    try {
      await adminDb.collection("services").doc(id).update({
        title, description, features, icon, sort_order, is_active,
        updated_at: new Date().toISOString()
      });
      const doc = await adminDb.collection("services").doc(id).get();
      return res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/services/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await adminDb.collection("services").doc(id).delete();
      return res.status(204).end();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // PACKAGES CRUD
  app.get("/api/packages", async (_req: Request, res: Response) => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set FIREBASE_PROJECT_ID environment variable.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const snapshot = await adminDb.collection("packages")
        .where("is_active", "==", true)
        .orderBy("sort_order", "asc")
        .orderBy("created_at", "desc")
        .get();
      
      const packages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(packages);
    } catch (err: any) {
      console.error("Unexpected error in /api/packages:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR",
        details: err.message
      });
    }
  });

  app.get("/api/admin/packages", async (_req: Request, res: Response) => {
    try {
      const snapshot = await adminDb.collection("packages")
        .orderBy("sort_order", "asc")
        .orderBy("created_at", "desc")
        .get();
      const packages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(packages);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/packages", async (req: Request, res: Response) => {
    try {
      const { name, price, description, features, is_recommended, sort_order, is_active } = req.body || {};
      if (!name || !price) {
        return res.status(400).json({ message: "name and price are required" });
      }
      
      const insertData = {
        name: name.trim(),
        price: price.trim(),
        description: description ? description.trim() : null,
        features: Array.isArray(features) ? features : [],
        is_recommended: is_recommended === true,
        sort_order: typeof sort_order === 'number' ? sort_order : 0,
        is_active: is_active !== false,
        created_at: new Date().toISOString()
      };
      
      const docRef = await adminDb.collection("packages").add(insertData);
      const doc = await docRef.get();
      return res.status(201).json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      console.error('Server error:', error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  });

  app.put("/api/admin/packages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, price, description, features, is_recommended, sort_order, is_active } = req.body || {};
      
      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (price !== undefined) updateData.price = price.trim();
      if (description !== undefined) updateData.description = description ? description.trim() : null;
      if (features !== undefined) updateData.features = Array.isArray(features) ? features : [];
      if (is_recommended !== undefined) updateData.is_recommended = is_recommended === true;
      if (sort_order !== undefined) updateData.sort_order = typeof sort_order === 'number' ? sort_order : 0;
      if (is_active !== undefined) updateData.is_active = is_active === true;
      updateData.updated_at = new Date().toISOString();
      
      await adminDb.collection("packages").doc(id).update(updateData);
      const doc = await adminDb.collection("packages").doc(id).get();
      return res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      console.error('Server error:', error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  });

  app.delete("/api/admin/packages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await adminDb.collection("packages").doc(id).delete();
      return res.status(204).end();
    } catch (error: any) {
      console.error('Server error during package deletion:', error);
      return res.status(500).json({ 
        message: "Internal server error during package deletion",
        details: error.message
      });
    }
  });

  // FEEDBACK CRUD
  // Public route to get all approved feedback
  app.get("/api/feedback", async (_req: Request, res: Response) => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set FIREBASE_PROJECT_ID environment variable.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const snapshot = await adminDb.collection("feedback")
        .where("is_approved", "==", true)
        .orderBy("created_at", "desc")
        .get();
      
      const feedbackList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(feedbackList);
    } catch (err: any) {
      console.error("Unexpected error in /api/feedback:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Public route to submit feedback (no authentication required)
  app.post("/api/feedback", async (req: Request, res: Response) => {
    try {
      const payload = req.body as any;
      
      // Validate required fields
      if (!payload.rating || !payload.message) {
        return res.status(400).json({ message: "rating and message are required" });
      }

      // Validate rating range
      if (payload.rating < 1 || payload.rating > 5) {
        return res.status(400).json({ message: "rating must be between 1 and 5" });
      }

      const insertData: any = {
        name: payload.name && payload.name.trim() !== "" ? payload.name : "Anonymous",
        email: payload.email && payload.email.trim() !== "" ? payload.email : null,
        rating: payload.rating,
        message: payload.message,
        project_id: payload.project_id || null,
        is_approved: true, // Auto-approve by default, can be changed for moderation
        created_at: new Date().toISOString()
      };

      const docRef = await adminDb.collection("feedback").add(insertData);
      const doc = await docRef.get();
      return res.status(201).json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Admin routes for feedback management
  app.get("/api/admin/feedback", async (_req: Request, res: Response) => {
    try {
      const snapshot = await adminDb.collection("feedback")
        .orderBy("created_at", "desc")
        .get();
      const feedbackList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return res.json(feedbackList);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/feedback/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body as any;

      const updateData: any = {};
      const allowedFields = ['is_approved', 'name', 'email', 'rating', 'message', 'project_id'];

      allowedFields.forEach(field => {
        if (payload[field] !== undefined) {
          updateData[field] = payload[field];
        }
      });
      updateData.updated_at = new Date().toISOString();

      await adminDb.collection("feedback").doc(id).update(updateData);
      const doc = await adminDb.collection("feedback").doc(id).get();
      return res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/feedback/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await adminDb.collection("feedback").doc(id).delete();
      return res.status(204).end();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Email sending endpoint (for generic contact)
  app.post("/api/send-email", async (req: Request, res: Response) => {
    try {
      const { to, from, subject, text } = req.body;
      
      console.log("Email request received:", { to, from, subject });
      
      // Check if required environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email configuration missing. EMAIL_USER:", process.env.EMAIL_USER, "EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
        return res.status(500).json({ 
          message: "Email configuration missing", 
          error: "Please check server configuration" 
        });
      }
      
      console.log("Using email credentials - User:", process.env.EMAIL_USER, "Pass length:", process.env.EMAIL_PASS.replace(/\s+/g, '').length);
      
      // Create transporter with Gmail SMTP using modern authentication
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS.replace(/\s+/g, '') // Remove any spaces
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      console.log("Attempting to verify email transporter...");
      
      // Verify transporter configuration
      await transporter.verify();
      console.log("Email transporter verified successfully");
      
      // Send email
      const info = await transporter.sendMail({
        from: `"Lupus Venture" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: `<div><h2>New Project Submission</h2><p><strong>From:</strong> ${from}</p><pre>${text.replace(/\n/g, '<br>')}</pre></div>`
      });
      
      console.log("Email sent successfully to:", to, "Message ID:", info.messageId);
      return res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
    } catch (error: any) {
      console.error("Error sending email:", error);
      // Provide more detailed error information
      let errorDetails: any = {
        message: "Failed to send email",
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response
      };
      
      // Handle specific Gmail authentication errors
      if (error.message && (error.message.includes("Invalid login") || error.message.includes("BadCredentials"))) {
        errorDetails.message = "Email authentication failed. Please check email configuration.";
        errorDetails.suggestion = "If using Gmail, ensure you're using an App Password, not your regular password. Also check that 2-factor authentication is properly configured.";
      }
      
      return res.status(500).json(errorDetails);
    }
  });

  // Test email configuration endpoint
  app.get("/api/test-email-config", async (_req: Request, res: Response) => {
    try {
      // Check if required environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ 
          message: "Email configuration missing", 
          error: "Please check server configuration" 
        });
      }
      
      // Create transporter with Gmail SMTP using modern authentication
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS.replace(/\s+/g, '') // Remove any spaces
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      // Verify transporter configuration
      await transporter.verify();
      
      return res.status(200).json({ message: "Email configuration is valid" });
    } catch (error: any) {
      console.error("Error testing email configuration:", error);
      let errorDetails: any = {
        message: "Email configuration test failed",
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response
      };
      
      // Handle specific Gmail authentication errors
      if (error.message && (error.message.includes("Invalid login") || error.message.includes("BadCredentials"))) {
        errorDetails.suggestion = "If using Gmail, ensure you're using an App Password, not your regular password. Also check that 2-factor authentication is properly configured.";
      }
      
      return res.status(500).json(errorDetails);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}


