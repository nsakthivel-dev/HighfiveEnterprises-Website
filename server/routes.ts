import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./supabase";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import nodemailer from "nodemailer";

// Add a helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE);
};

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

      const file = req.file;
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        return res.status(500).json({ error: "Failed to upload file to storage" });
      }

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      return res.status(200).json({ url: urlData.publicUrl });
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

      // Upload each file
      for (const file of files) {
        try {
          const fileExt = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { data, error } = await supabase.storage
            .from("media")
            .upload(filePath, file.buffer, {
              contentType: file.mimetype,
            });

          if (error) {
            console.error(`Supabase storage error for ${file.originalname}:`, error);
            errors.push(`Failed to upload ${file.originalname}`);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(filePath);

          uploadedUrls.push(urlData.publicUrl);
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

  // put application routes here
  // prefix all routes with /api

  // Activity: list, create, delete
  app.get("/api/activity", async (_req: Request, res: Response) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const { data, error } = await supabase
        .from("activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Supabase error in /api/activity:", error);
        return res.status(500).json({ 
          message: error.message,
          code: "DATABASE_ERROR"
        });
      }
      return res.json(data ?? []);
    } catch (err) {
      console.error("Unexpected error in /api/activity:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  });

  app.post("/api/activity", async (req: Request, res: Response) => {
    const { type, title } = req.body || {};
    if (!type || !title) return res.status(400).json({ message: "type and title are required" });
    const { data, error } = await supabase.from("activity").insert([{ type, title }]).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/activity/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("activity").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(204).end();
  });

  // SERVICES CRUD
  app.get("/api/services", async (_req: Request, res: Response) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error in /api/services:", error);
        return res.status(500).json({ 
          message: error.message,
          code: "DATABASE_ERROR"
        });
      }
      return res.json(data ?? []);
    } catch (err) {
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
    const { data, error } = await supabase
      .from("services")
      .insert([{ title, description, features: features ?? [], icon: icon ?? null, sort_order: sort_order ?? 0, is_active: is_active ?? true }])
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data);
  });

  app.put("/api/services/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, features, icon, sort_order, is_active } = req.body || {};
    const { data, error } = await supabase
      .from("services")
      .update({ title, description, features, icon, sort_order, is_active })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/services/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(204).end();
  });

  // PACKAGES CRUD
  app.get("/api/packages", async (_req: Request, res: Response) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error in /api/packages:", error);
        return res.status(500).json({ 
          message: error.message,
          code: "DATABASE_ERROR"
        });
      }
      return res.json(data ?? []);
    } catch (err) {
      console.error("Unexpected error in /api/packages:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  });

  app.get("/api/admin/packages", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
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
      };
      
      const { data, error } = await supabase
        .from("packages")
        .insert([insertData])
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: error.message });
      }
      return res.status(201).json(data);
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
      
      const { data, error } = await supabase
        .from("packages")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: error.message });
      }
      return res.json(data);
    } catch (error: any) {
      console.error('Server error:', error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  });

  app.delete("/api/admin/packages/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(204).end();
  });

  // FEEDBACK CRUD
  // Public route to get all approved feedback
  app.get("/api/feedback", async (_req: Request, res: Response) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ 
        message: "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
        code: "DATABASE_NOT_CONFIGURED"
      });
    }

    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error in /api/feedback:", error);
        return res.status(500).json({ 
          message: error.message,
          code: "DATABASE_ERROR"
        });
      }
      return res.json(data ?? []);
    } catch (err) {
      console.error("Unexpected error in /api/feedback:", err);
      return res.status(500).json({ 
        message: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Public route to submit feedback (no authentication required)
  app.post("/api/feedback", async (req: Request, res: Response) => {
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
    };

    const { data, error } = await supabase
      .from("feedback")
      .insert(insertData)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  });

  // Admin routes for feedback management
  app.get("/api/admin/feedback", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  app.put("/api/admin/feedback/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;

    const updateData: any = {};
    const allowedFields = ['is_approved', 'name', 'email', 'rating', 'message', 'project_id'];

    allowedFields.forEach(field => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    const { data, error } = await supabase
      .from("feedback")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/admin/feedback/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
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


