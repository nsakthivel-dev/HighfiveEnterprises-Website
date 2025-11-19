import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./supabase";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

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

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
  // TEAM MEMBERS
  app.get("/api/team", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });



  app.post("/api/team", async (req: Request, res: Response) => {
    const payload = req.body as any;
    
    console.log("[POST /api/team] Received payload:", JSON.stringify(payload, null, 2));
    
    // Validate required fields
    if (!payload.name || payload.name.trim() === "") {
      console.log("[POST /api/team] Error: Name is required");
      return res.status(400).json({ message: "Name is required" });
    }
    if (!payload.role || payload.role.trim() === "") {
      console.log("[POST /api/team] Error: Role is required");
      return res.status(400).json({ message: "Role is required" });
    }
    
    // Check if email already exists (if email is provided)
    if (payload.email && payload.email.trim() !== "") {
      const { data: existingMember } = await supabase
        .from("team_members")
        .select("id, name, email")
        .eq("email", payload.email.trim())
        .single();
      
      if (existingMember) {
        console.log("[POST /api/team] Error: Email already exists", existingMember);
        return res.status(400).json({ 
          message: `This email is already used by ${existingMember.name}. Please use a different email or leave it empty.` 
        });
      }
    }
    
    const insertData = {
      name: payload.name.trim(),
      role: payload.role.trim(),
      avatar_url: payload.avatar_url ?? null,
      bio: payload.bio ?? null,
      email: (payload.email && payload.email.trim() !== "") ? payload.email.trim() : null,
      linkedin: (payload.linkedin && payload.linkedin.trim() !== "") ? payload.linkedin.trim() : null,
      status: payload.status ?? "Active",
    };
    
    console.log("[POST /api/team] Inserting data:", JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from("team_members")
      .insert(insertData)
      .select()
      .single();
      
    if (error) {
      console.error("[POST /api/team] Supabase error:", JSON.stringify(error, null, 2));
      
      // Handle duplicate email error with user-friendly message
      if (error.code === "23505" && error.message?.includes("email")) {
        return res.status(400).json({ 
          message: "This email address is already in use by another team member. Please use a different email or leave it empty." 
        });
      }
      
      return res.status(400).json({ message: error.message, details: error });
    }
    
    console.log("[POST /api/team] Success:", JSON.stringify(data, null, 2));
    return res.status(201).json(data);
  });

  app.put("/api/team/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;
    
    // Check if email already exists for a different member (if email is provided)
    if (payload.email && payload.email.trim() !== "") {
      const { data: existingMember } = await supabase
        .from("team_members")
        .select("id, name, email")
        .eq("email", payload.email.trim())
        .neq("id", id)
        .single();
      
      if (existingMember) {
        return res.status(400).json({ 
          message: `This email is already used by ${existingMember.name}. Please use a different email or leave it empty.` 
        });
      }
    }
    
    const { data, error } = await supabase
      .from("team_members")
      .update({
        name: payload.name,
        role: payload.role,
        avatar_url: payload.avatar_url,
        bio: payload.bio,
        email: (payload.email && payload.email.trim() !== "") ? payload.email.trim() : null,
        linkedin: (payload.linkedin && payload.linkedin.trim() !== "") ? payload.linkedin.trim() : null,
        status: payload.status,
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      // Handle duplicate email error with user-friendly message
      if (error.code === "23505" && error.message?.includes("email")) {
        return res.status(400).json({ 
          message: "This email address is already in use by another team member. Please use a different email or leave it empty." 
        });
      }
      return res.status(400).json({ message: error.message });
    }
    return res.json(data);
  });

  app.delete("/api/team/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
  });

  // NETWORK - COLLABORATIONS
  app.get("/api/network/collaborations", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("network_collaborations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  app.post("/api/network/collaborations", async (req: Request, res: Response) => {
    const payload = req.body as any;
    if (!payload.name || typeof payload.name !== "string") {
      return res.status(400).json({ message: "Name is required" });
    }

    const insertData = {
      name: payload.name.trim(),
      description: payload.description ?? null,
      highlight: payload.highlight ?? null,
      logo_url: payload.logo_url ?? null,
      link_url: payload.link_url ?? null,
    };

    const { data, error } = await supabase
      .from("network_collaborations")
      .insert(insertData)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  });

  app.put("/api/network/collaborations/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;

    const updateData: Record<string, any> = {};
    ["name", "description", "highlight", "logo_url", "link_url"].forEach((key) => {
      if (payload[key] !== undefined) updateData[key] = payload[key];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const { data, error } = await supabase
      .from("network_collaborations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/network/collaborations/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("network_collaborations").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
  });

  // NETWORK - OFFICIAL PARTNERS
  app.get("/api/network/partners", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("network_partners")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  app.post("/api/network/partners", async (req: Request, res: Response) => {
    const payload = req.body as any;
    if (!payload.name || typeof payload.name !== "string") {
      return res.status(400).json({ message: "Name is required" });
    }

    const insertData = {
      name: payload.name.trim(),
      role: payload.role ?? null,
      description: payload.description ?? null,
      logo_url: payload.logo_url ?? null,
      link_url: payload.link_url ?? null,
    };

    const { data, error } = await supabase
      .from("network_partners")
      .insert(insertData)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  });

  app.put("/api/network/partners/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;

    const updateData: Record<string, any> = {};
    ["name", "role", "description", "logo_url", "link_url"].forEach((key) => {
      if (payload[key] !== undefined) updateData[key] = payload[key];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const { data, error } = await supabase
      .from("network_partners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/network/partners/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("network_partners").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
  });

  // PROJECTS
  app.get("/api/projects", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });

    const projects = data.map((p: any) => {
        let techStack = [];
        if (p.tech_stack && typeof p.tech_stack === 'object') {
            const { frontend = [], backend = [], database = [], other = [] } = p.tech_stack;
            techStack = [...frontend, ...backend, ...database, ...other];
        } else if (Array.isArray(p.tech_stack)) {
            techStack = p.tech_stack;
        }
        return { ...p, tech_stack: techStack };
    });

    return res.json(projects ?? []);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    const payload = req.body as any;
    
    // Validate required fields
    if (!payload.title || payload.title.trim() === "") {
      return res.status(400).json({ success: false, error: "Title is required" });
    }
    
    // Map status to database format
    const dbStatus = payload.status;
    
    try {
      // Prepare insert data - handle arrays by converting to JSON if needed
      const insertData: any = {
        title: payload.title.trim(),
        description: payload.description ?? null,
        image_url: payload.image_url ?? null,
        status: dbStatus,
        url: payload.url ?? null,
      };

      // Add optional fields only if they exist
      if (payload.tagline !== undefined) insertData.tagline = payload.tagline;
      if (payload.overview !== undefined) insertData.overview = payload.overview;
      if (payload.problem !== undefined) insertData.problem = payload.problem;
      if (payload.solution !== undefined) insertData.solution = payload.solution;
      if (payload.architecture !== undefined) insertData.architecture = payload.architecture;
      if (payload.role !== undefined) insertData.role = payload.role;
      if (payload.timeline !== undefined) insertData.timeline = payload.timeline;
      if (payload.outcomes !== undefined) insertData.outcomes = payload.outcomes;
      if (payload.challenges !== undefined) insertData.challenges = payload.challenges;
      if (payload.demo_url !== undefined) insertData.demo_url = payload.demo_url;
      if (payload.github_url !== undefined) insertData.github_url = payload.github_url;
      if (payload.case_study_url !== undefined) insertData.case_study_url = payload.case_study_url;
      if (payload.hero_image !== undefined) insertData.hero_image = payload.hero_image;
      if (payload.demo_video !== undefined) insertData.demo_video = payload.demo_video;

      // Handle array fields based on Supabase schema:
      // tech_stack is JSONB with structure: {"other": [], "backend": [], "database": [], "frontend": []}
      // key_features might be text[] (PostgreSQL array) - pass as array directly, not stringified
      // screenshots is text (store as JSON string)
      // case_study_urls is text[] (PostgreSQL array) - pass as array directly
      // project_photos is text[] (PostgreSQL array) - pass as array directly
      
      // key_features - based on error, it seems to be text[] not text, so pass as array
      if (payload.key_features !== undefined && payload.key_features !== null) {
        if (Array.isArray(payload.key_features)) {
          // Pass as array directly for text[] column (Supabase will handle conversion)
          insertData.key_features = payload.key_features;
        } else {
          insertData.key_features = payload.key_features;
        }
      }
      
      // tech_stack is JSONB, structure it properly
      if (payload.tech_stack !== undefined && payload.tech_stack !== null) {
        if (Array.isArray(payload.tech_stack)) {
          insertData.tech_stack = {
            frontend: payload.tech_stack.filter((tech: string) => 
              ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'CSS', 'HTML', 'JavaScript', 'TypeScript'].some(t => tech.includes(t))
            ),
            backend: payload.tech_stack.filter((tech: string) => 
              ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Rust', 'Java', 'Spring'].some(t => tech.includes(t))
            ),
            database: payload.tech_stack.filter((tech: string) => 
              ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'].some(t => tech.includes(t))
            ),
            other: payload.tech_stack.filter((tech: string) => {
              const all = ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'CSS', 'HTML', 'JavaScript', 'TypeScript',
                           'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Rust', 'Java', 'Spring',
                           'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'];
              return !all.some(t => tech.includes(t));
            })
          };
        } else {
          insertData.tech_stack = payload.tech_stack;
        }
      }
      
      // screenshots - if provided as array, keep as array for text column
      // Note: screenshots is deprecated, use project_photos instead
      if (payload.screenshots !== undefined && payload.screenshots !== null) {
        if (typeof payload.screenshots === 'string') {
          // If it's already a string, use it as-is
          insertData.screenshots = payload.screenshots;
        } else if (Array.isArray(payload.screenshots)) {
          // If it's an array, let Supabase handle the conversion
          // Don't JSON.stringify it - that causes the malformed array literal error
          insertData.screenshots = payload.screenshots;
        }
      }
      
      // case_study_urls is text[] - pass as array directly (Supabase handles conversion)
      if (payload.case_study_urls !== undefined && payload.case_study_urls !== null) {
        if (Array.isArray(payload.case_study_urls)) {
          insertData.case_study_urls = payload.case_study_urls;
        } else {
          insertData.case_study_urls = payload.case_study_urls;
        }
      }
      
      // project_photos is text[] - pass as array directly (Supabase handles conversion)
      if (payload.project_photos !== undefined && payload.project_photos !== null) {
        if (Array.isArray(payload.project_photos)) {
          insertData.project_photos = payload.project_photos;
        } else {
          insertData.project_photos = payload.project_photos;
        }
      }

      console.log("Inserting project with data:", JSON.stringify(insertData, null, 2));
      console.log("Mapped status from", payload.status, "to", dbStatus);

      const { data, error } = await supabase
        .from("projects")
        .insert(insertData)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Attempted status value:", dbStatus);
        
        // If it's a check constraint error, try to get valid values from existing projects
        if (error.message?.includes('check constraint') && error.message?.includes('status')) {
          const { data: existingProjects } = await supabase
            .from("projects")
            .select("status")
            .limit(10);
          
          const validStatuses = Array.from(new Set(existingProjects?.map(p => p.status).filter(Boolean) || []));
          console.error("Found existing status values in database:", validStatuses);
          
          return res.status(400).json({ 
            success: false, 
            error: `Invalid status value. Attempted: "${dbStatus}". Valid values might be: ${validStatuses.join(', ') || 'unknown'}. Original error: ${error.message}`,
            details: error,
            attemptedStatus: dbStatus,
            suggestedStatuses: validStatuses
          });
        }
        
        return res.status(400).json({ success: false, error: error.message, details: error });
      }
      
      let techStack = [];
      if (data.tech_stack && typeof data.tech_stack === 'object') {
          const { frontend = [], backend = [], database = [], other = [] } = data.tech_stack;
          techStack = [...frontend, ...backend, ...database, ...other];
      } else if (Array.isArray(data.tech_stack)) {
          techStack = data.tech_stack;
      }

      return res.status(201).json({ success: true, data: { ...data, tech_stack: techStack } });
    } catch (err: any) {
      console.error("Server error:", err);
      return res.status(500).json({ success: false, error: err.message || "Server error" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ message: "Project not found" });
    if (!data) return res.status(404).json({ message: "Project not found" });

    let techStack = [];
    if (data.tech_stack && typeof data.tech_stack === 'object') {
        const { frontend = [], backend = [], database = [], other = [] } = data.tech_stack;
        techStack = [...frontend, ...backend, ...database, ...other];
    } else if (Array.isArray(data.tech_stack)) {
        techStack = data.tech_stack;
    }

    return res.json({ ...data, tech_stack: techStack });
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;

    try {
      // Prepare update data, only including fields that are present in the payload
      const updateData: any = {};

      // Simple fields that can be updated directly
      const fieldsToUpdate = [
        'title', 'description', 'image_url', 'status', 'url', 'tagline', 'overview',
        'problem', 'solution', 'architecture', 'role', 'timeline', 'outcomes',
        'challenges', 'demo_url', 'github_url', 'case_study_url', 'hero_image', 'demo_video'
      ];

      fieldsToUpdate.forEach(field => {
        if (payload[field] !== undefined) {
          updateData[field] = payload[field];
        }
      });

      // Handle complex fields with specific logic, mirroring the POST endpoint
      if (payload.key_features !== undefined) updateData.key_features = payload.key_features;
      if (payload.case_study_urls !== undefined) updateData.case_study_urls = payload.case_study_urls;
      if (payload.project_photos !== undefined) updateData.project_photos = payload.project_photos;

      // screenshots - handle both string and array (deprecated, use project_photos)
      if (payload.screenshots !== undefined) {
        if (typeof payload.screenshots === 'string') {
          updateData.screenshots = payload.screenshots;
        } else if (Array.isArray(payload.screenshots)) {
          // Let Supabase handle array conversion, don't stringify
          updateData.screenshots = payload.screenshots;
        }
      }

      if (payload.tech_stack !== undefined) {
        if (Array.isArray(payload.tech_stack)) {
          updateData.tech_stack = {
            frontend: payload.tech_stack.filter((tech: string) => ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'CSS', 'HTML', 'JavaScript', 'TypeScript'].some(t => tech.includes(t))),
            backend: payload.tech_stack.filter((tech: string) => ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Rust', 'Java', 'Spring'].some(t => tech.includes(t))),
            database: payload.tech_stack.filter((tech: string) => ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'].some(t => tech.includes(t))),
            other: payload.tech_stack.filter((tech: string) => {
              const all = ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'CSS', 'HTML', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Rust', 'Java', 'Spring', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'];
              return !all.some(t => tech.includes(t));
            })
          };
        } else {
          updateData.tech_stack = payload.tech_stack;
        }
      }

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return res.status(400).json({ success: false, error: error.message });
      }

      let techStack = [];
      if (data && data.tech_stack && typeof data.tech_stack === 'object') {
          const { frontend = [], backend = [], database = [], other = [] } = data.tech_stack;
          techStack = [...frontend, ...backend, ...database, ...other];
      } else if (data && Array.isArray(data.tech_stack)) {
          techStack = data.tech_stack;
      }

      return res.status(200).json({ success: true, data: { ...data, tech_stack: techStack } });
    } catch (err: any) {
      console.error("Server error during project update:", err);
      return res.status(500).json({ success: false, error: err.message || "Server error" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
  });

  // Activity: list, create, delete
  app.get("/api/activity", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
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

  // Applications (careers): submit and list
  app.get("/api/applications", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  app.post("/api/applications", async (req: Request, res: Response) => {
    const { name, email, role, portfolio_url, resume_url, message } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: "name and email are required" });
    const { data, error } = await supabase
      .from("applications")
      .insert([{ name, email, role: role ?? null, portfolio_url: portfolio_url ?? null, resume_url: resume_url ?? null, message: message ?? null }])
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data);
  });

  // SERVICES CRUD
  app.get("/api/services", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
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
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
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

  // EVENTS CRUD
  // Public route to get all events
  app.get("/api/events", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  // Admin routes for events management
  app.get("/api/admin/events", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
  });

  app.post("/api/admin/events", async (req: Request, res: Response) => {
    const payload = req.body as any;
    
    // Validate required fields
    if (!payload.title || !payload.event_date) {
      return res.status(400).json({ message: "title and event_date are required" });
    }

    const insertData: any = {
      title: payload.title,
      description: payload.description ?? null,
      event_date: payload.event_date,
      location: payload.location ?? null,
      image_url: payload.image_url ?? null,
      category: payload.category ?? null,
      status: payload.status ?? "upcoming",
      featured: payload.featured ?? false,
      organizers: Array.isArray(payload.organizers) ? payload.organizers : (payload.organizers ? payload.organizers.split(",").map((org: string) => org.trim()) : []),
      tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags ? payload.tags.split(",").map((tag: string) => tag.trim()) : [])
    };

    const { data, error } = await supabase
      .from("events")
      .insert(insertData)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  });

  app.put("/api/admin/events/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body as any;

    const updateData: any = {};
    const allowedFields = [
      'title', 'description', 'event_date', 'location', 'image_url', 
      'category', 'status', 'featured', 'organizers', 'tags'
    ];

    allowedFields.forEach(field => {
      if (payload[field] !== undefined) {
        if (field === 'tags' || field === 'organizers') {
          // Handle arrays
          updateData[field] = Array.isArray(payload[field]) 
            ? payload[field] 
            : (payload[field] ? payload[field].split(",").map((item: string) => item.trim()) : []);
        } else {
          updateData[field] = payload[field];
        }
      }
    });

    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  });

  app.delete("/api/admin/events/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).end();
  });

  // FEEDBACK CRUD
  // Public route to get all approved feedback
  app.get("/api/feedback", async (_req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data ?? []);
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

  const httpServer = createServer(app);

  return httpServer;
}


