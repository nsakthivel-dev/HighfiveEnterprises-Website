import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import MultipleFileUpload from "@/components/MultipleFileUpload";
import { Plus, Upload, X, Edit, Trash2, ExternalLink, FileText, Users, Code, Image as ImageIcon, Link as LinkIcon, Info, Briefcase } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {};
    if (!(init?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
  
    const res = await fetch(url, { headers, ...init });
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        const error = new Error(errorJson.error || 'API request failed') as any;
        error.error = errorJson.error;
        error.details = errorJson.details;
        error.status = res.status;
        throw error;
      } catch (e) {
        if (e instanceof Error) {
          throw e;
        }
        throw new Error(errorText || 'API request failed');
      }
    }
    return res.json();
  }

  type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatar_url?: string | null;
  };

  type Project = {
    id: string;
    title: string;
    description: string;
    tagline?: string | null;
    category?: string | null;
    status?: 'completed' | 'in-progress' | 'active-maintenance' | null;
    problem?: string | null;
    solution?: string | null;
    tech_stack: string[];
    team_members?: string[] | null;
    key_features?: string[] | null;
    timeline?: string | null;
    hero_image_url?: string | null;
    thumbnail_url?: string | null;
    project_photos?: string[] | null;
    project_video?: string | null;
    screenshots?: string[];
    github_url?: string | null;
    demo_url?: string | null;
    case_study_urls?: string[] | null;
    challenge?: string | null;
    outcome?: string | null;
    role?: string | null;
    architecture?: string | null;
    created_at?: string;
  };

const Projects = () => {
    const qc = useQueryClient();
    const { toast } = useToast();
    
    // Fetch projects
    const { data: projects = [] } = useQuery<Project[], Error>({
        queryKey: ["projects"],
        queryFn: () => api<Project[]>("/api/projects"),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      });

    // Fetch team members for multi-select
    const { data: teamMembers = [] } = useQuery<TeamMember[], Error>({
        queryKey: ["team-members"],
        queryFn: () => api<TeamMember[]>("/api/team"),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      });

    // Mutations
    const addProject = useMutation({
        mutationFn: async (payload: Partial<Project>) => {
          const response = await api<{ success: boolean; data: Project }>("/api/projects", { 
            method: "POST", 
            body: JSON.stringify(payload) 
          });
          return response.data;
        },
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          setEditingProject(null);
          toast({ title: "Success", description: "Project created successfully" });
        },
        onError: (error: any) => {
          console.error("Failed to create project:", error);
          const errorMessage = error?.message || error?.error || 'Unknown error occurred';
          toast({ title: "Error", description: `Failed to create project: ${errorMessage}`, variant: "destructive" });
        }
      });
      
      const updateProject = useMutation({
        mutationFn: async (payload: { id: string; data: Partial<Project> }) => {
          const response = await api<Project>(`/api/projects/${payload.id}`, { 
            method: "PUT", 
            body: JSON.stringify(payload.data) 
          });
          return response;
        },
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          setEditingProject(null);
          toast({ title: "Success", description: "Project updated successfully" });
        },
        onError: (error) => {
          console.error("Failed to update project:", error);
          toast({ title: "Error", description: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: "destructive" });
        }
      });
      
      const deleteProject = useMutation({
        mutationFn: (id: string) => api<void>(`/api/projects/${id}`, { method: "DELETE" }),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["projects"] });
          toast({ title: "Success", description: "Project deleted successfully" });
        },
        onError: (error) => {
          toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
        }
      });

      // Form state
      const [projectForm, setProjectForm] = useState<Partial<Project>>({ 
        title: "", 
        description: "", 
        tech_stack: [],
        status: 'in-progress',
        category: 'Web Development',
        team_members: [],
        key_features: [],
        project_photos: [],
        case_study_urls: []
      });
      const [editingProject, setEditingProject] = useState<string | "new" | null>(null);
      const [uploadingImage, setUploadingImage] = useState(false);
      const [uploadingVideo, setUploadingVideo] = useState(false);
      const [activeTab, setActiveTab] = useState("basic");

      // File upload functions
      const uploadFile = async (file: File, type: 'image' | 'video') => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        return data.url;
      };

      const handleImageUpload = async (file: File, field: 'hero_image_url' | 'thumbnail_url') => {
        setUploadingImage(true);
        try {
          const imageUrl = await uploadFile(file, 'image');
          setProjectForm({ ...projectForm, [field]: imageUrl });
          toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (error) {
          console.error('Image upload failed:', error);
          toast({ title: "Error", description: "Image upload failed", variant: "destructive" });
        } finally {
          setUploadingImage(false);
        }
      };

      const handleVideoUpload = async (file: File) => {
        setUploadingVideo(true);
        try {
          const videoUrl = await uploadFile(file, 'video');
          setProjectForm({ ...projectForm, project_video: videoUrl });
          toast({ title: "Success", description: "Video uploaded successfully" });
        } catch (error) {
          console.error('Video upload failed:', error);
          toast({ title: "Error", description: "Video upload failed", variant: "destructive" });
        } finally {
          setUploadingVideo(false);
      }
    };

  const canSubmitProject = useMemo(() => !!projectForm.title?.trim() && !!projectForm.description?.trim(), [projectForm]);

  const handleSubmit = async () => {
    // Prepare the payload, mapping frontend fields to backend field names
    const payload: any = {
      title: projectForm.title?.trim() || "",
      description: projectForm.description || null,
      status: projectForm.status || 'Active Maintenance',
    };

    // Add optional fields only if they have values
    if (projectForm.tagline) payload.tagline = projectForm.tagline;
    if (projectForm.problem) payload.problem = projectForm.problem;
    if (projectForm.solution) payload.solution = projectForm.solution;
    if (projectForm.timeline) payload.timeline = projectForm.timeline;
    if (projectForm.role) payload.role = projectForm.role;
    if (projectForm.architecture) payload.architecture = projectForm.architecture;
    if (projectForm.outcome) payload.outcomes = projectForm.outcome;
    if (projectForm.challenge) payload.challenges = projectForm.challenge;
    if (projectForm.demo_url) payload.demo_url = projectForm.demo_url;
    if (projectForm.github_url) payload.github_url = projectForm.github_url;
    if (projectForm.hero_image_url) payload.hero_image = projectForm.hero_image_url;
    if (projectForm.project_video) payload.demo_video = projectForm.project_video;
    if (projectForm.category) payload.category = projectForm.category;
    
    // Handle image_url - use thumbnail if available
    if (projectForm.thumbnail_url) {
      payload.image_url = projectForm.thumbnail_url;
    }
    if (projectForm.demo_url) {
      payload.url = projectForm.demo_url;
    }

    // Handle array fields - only include if they have values
    if (Array.isArray(projectForm.tech_stack) && projectForm.tech_stack.length > 0) {
      payload.tech_stack = projectForm.tech_stack;
    }
    if (Array.isArray(projectForm.key_features) && projectForm.key_features.length > 0) {
      payload.key_features = projectForm.key_features;
    }
    // project_photos is text[] - send as array directly
    if (Array.isArray(projectForm.project_photos) && projectForm.project_photos.length > 0) {
      payload.project_photos = projectForm.project_photos;
    }
    // case_study_urls is text[] - send as array
    if (Array.isArray(projectForm.case_study_urls) && projectForm.case_study_urls.length > 0) {
      payload.case_study_urls = projectForm.case_study_urls;
      // Also set case_study_url to first one for backward compatibility
      payload.case_study_url = projectForm.case_study_urls[0];
    }
    
    // Add team_members field
    if (Array.isArray(projectForm.team_members) && projectForm.team_members.length > 0) {
      payload.team_members = projectForm.team_members;
    }

    console.log("Submitting project payload:", JSON.stringify(payload, null, 2));

    if (editingProject === "new") {
      addProject.mutate(payload);
    } else if (editingProject) {
      updateProject.mutate({ id: editingProject, data: payload });
    }
  };

  const resetForm = () => {
    setProjectForm({
      title: "", 
      description: "", 
      tech_stack: [],
      status: 'in-progress',
      category: 'Web Development',
      team_members: [],
      key_features: [],
      project_photos: [],
      case_study_urls: []
    });
    setActiveTab("basic");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project.id);
    setProjectForm(project);
    setActiveTab("basic");
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject.mutate(id);
    }
  };

  return (
      <AdminLayout title="Projects" description="Manage your portfolio projects and showcase your work.">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Project Portfolio</h2>
              <p className="text-sm text-muted-foreground mt-1">Showcase your work and achievements</p>
            </div>
            <Button onClick={() => { setEditingProject("new"); resetForm(); }} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
          
          <Separator />
          
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Start building your portfolio by adding your first project</p>
              <Button onClick={() => { setEditingProject("new"); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-muted">
                    <img 
                      src={project.thumbnail_url ?? project.project_photos?.[0] ?? "/placeholder.svg"} 
                      alt={project.title} 
                      className="w-full h-full object-cover" 
                    />
                    {project.status && (
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}
                        className="absolute top-2 right-2"
                      >
                        {project.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{project.title}</h3>
                      {project.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.tagline}</p>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    
                    {project.category && (
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    )}
                    
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{project.tech_stack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleDelete(project.id, project.title)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Project Form Dialog */}
        <Dialog open={!!editingProject} onOpenChange={(open) => { if (!open) { setEditingProject(null); resetForm(); } }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-2xl">
                {editingProject === "new" ? "Create New Project" : "Edit Project"}
              </DialogTitle>
              <DialogDescription>
                {editingProject === "new" 
                  ? "Fill in the details to add a new project to your portfolio" 
                  : "Update your project information"}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <div className="px-6 border-b">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic" className="gap-2">
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="description" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Media</span>
                  </TabsTrigger>
                  <TabsTrigger value="links" className="gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Links</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-240px)] px-6 py-6">
                {/* Tab 1: Basic Information */}
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">
                        Project Title <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="title"
                        value={projectForm.title || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} 
                        placeholder="Enter a compelling project title"
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input 
                        id="tagline"
                        value={projectForm.tagline || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} 
                        placeholder="A brief, catchy description (e.g., 'AI-powered task manager')"
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={projectForm.category || 'Web Development'} 
                        onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                      >
                        <SelectTrigger id="category" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Desktop Application">Desktop Application</SelectItem>
                          <SelectItem value="API/Backend">API/Backend</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Project Status</Label>
                      <Select 
                        value={projectForm.status || 'in-progress'} 
                        onValueChange={(value) => setProjectForm({ ...projectForm, status: value as any })}
                      >
                        <SelectTrigger id="status" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="active-maintenance">Active Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input 
                        id="timeline"
                        value={projectForm.timeline || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })} 
                        placeholder="e.g., Jan 2024 - Mar 2024, 3 months, Q1 2024"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 2: Description & Details */}
                <TabsContent value="description" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">
                        Project Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea 
                        id="description"
                        value={projectForm.description || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} 
                        placeholder="Provide a comprehensive overview of your project..."
                        rows={4}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="problem">Problem Statement</Label>
                      <Textarea 
                        id="problem"
                        value={projectForm.problem || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })} 
                        placeholder="What problem does this project solve?"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="solution">Solution</Label>
                      <Textarea 
                        id="solution"
                        value={projectForm.solution || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })} 
                        placeholder="How does your project solve the problem?"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="features">Key Features</Label>
                      <Textarea 
                        id="features"
                        value={projectForm.key_features?.join('\n') || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, key_features: e.target.value.split('\n').filter(f => f.trim()) })} 
                        placeholder="List key features (one per line)&#10;• Real-time collaboration&#10;• AI-powered suggestions&#10;• Cross-platform support"
                        rows={5}
                        className="mt-1.5 font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Enter each feature on a new line</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Your Role</Label>
                      <Input 
                        id="role"
                        value={projectForm.role || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })} 
                        placeholder="e.g., Lead Developer, Full Stack Engineer, Project Manager"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 3: Team & Tech Stack */}
                <TabsContent value="team" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label>Team Members</Label>
                      <p className="text-xs text-muted-foreground mb-3">Select team members who worked on this project</p>
                      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                        {teamMembers.length === 0 ? (
                          <p className="col-span-2 text-sm text-muted-foreground text-center py-4">
                            No team members available. Add team members first.
                          </p>
                        ) : (
                          teamMembers.map((member) => (
                            <label 
                              key={member.id} 
                              className="flex items-center gap-3 p-2.5 rounded-md border cursor-pointer hover:bg-accent transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={projectForm.team_members?.includes(member.id) || false}
                                onChange={(e) => {
                                  const currentMembers = projectForm.team_members || [];
                                  if (e.target.checked) {
                                    setProjectForm({ ...projectForm, team_members: [...currentMembers, member.id] });
                                  } else {
                                    setProjectForm({ ...projectForm, team_members: currentMembers.filter(id => id !== member.id) });
                                  }
                                }}
                                className="rounded"
                              />
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{member.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                </div>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                      {projectForm.team_members && projectForm.team_members.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {projectForm.team_members.length} member(s) selected
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="tech-stack">Technology Stack</Label>
                      <Input 
                        id="tech-stack"
                        value={projectForm.tech_stack?.join(", ") || ""} 
                        onChange={(e) => setProjectForm({ 
                          ...projectForm, 
                          tech_stack: e.target.value.split(",").map(s => s.trim()).filter(s => s) 
                        })} 
                        placeholder="React, Node.js, PostgreSQL, Docker, AWS"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Separate technologies with commas</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="architecture">Architecture</Label>
                      <Textarea 
                        id="architecture"
                        value={projectForm.architecture || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, architecture: e.target.value })} 
                        placeholder="Describe the technical architecture and design patterns used..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 4: Media Assets */}
                <TabsContent value="media" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    <div>
                      <MultipleFileUpload
                        label="Project Photos"
                        accept="image/*"
                        currentUrls={projectForm.project_photos || []}
                        onFilesUpload={(urls) => setProjectForm({ ...projectForm, project_photos: urls })}
                        maxFiles={8}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hero-image">Hero Image</Label>
                        <div className="space-y-2 mt-1.5">
                          <div className="flex gap-2">
                            <Input 
                              id="hero-image"
                              value={projectForm.hero_image_url || ""} 
                              onChange={(e) => setProjectForm({ ...projectForm, hero_image_url: e.target.value })} 
                              placeholder="https://..."
                            />
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleImageUpload(file, 'hero_image_url');
                                };
                                input.click();
                              }}
                              disabled={uploadingImage}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                          {projectForm.hero_image_url && (
                            <div className="relative">
                              <img 
                                src={projectForm.hero_image_url} 
                                alt="Hero preview" 
                                className="w-full h-24 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1"
                                onClick={() => setProjectForm({ ...projectForm, hero_image_url: '' })}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <div className="space-y-2 mt-1.5">
                          <div className="flex gap-2">
                            <Input 
                              id="thumbnail"
                              value={projectForm.thumbnail_url || ""} 
                              onChange={(e) => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })} 
                              placeholder="https://..."
                            />
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleImageUpload(file, 'thumbnail_url');
                                };
                                input.click();
                              }}
                              disabled={uploadingImage}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                          {projectForm.thumbnail_url && (
                            <div className="relative">
                              <img 
                                src={projectForm.thumbnail_url} 
                                alt="Thumbnail preview" 
                                className="w-full h-24 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1"
                                onClick={() => setProjectForm({ ...projectForm, thumbnail_url: '' })}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="video">Project Video</Label>
                      <div className="space-y-2 mt-1.5">
                        <div className="flex gap-2">
                          <Input 
                            id="video"
                            value={projectForm.project_video || ""} 
                            onChange={(e) => setProjectForm({ ...projectForm, project_video: e.target.value })} 
                            placeholder="https://youtube.com/... or upload video"
                          />
                          <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'video/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleVideoUpload(file);
                              };
                              input.click();
                            }}
                            disabled={uploadingVideo}
                          >
                            {uploadingVideo ? "Uploading..." : <Upload className="w-4 h-4" />}
                          </Button>
                        </div>
                        {projectForm.project_video && (
                          <a 
                            href={projectForm.project_video} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Preview video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 5: Links */}
                <TabsContent value="links" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="demo-url">Demo URL</Label>
                      <Input 
                        id="demo-url"
                        value={projectForm.demo_url || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })} 
                        placeholder="https://demo.yourproject.com"
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="github-url">GitHub Repository</Label>
                      <Input 
                        id="github-url"
                        value={projectForm.github_url || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} 
                        placeholder="https://github.com/username/repo"
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label>Case Study URLs</Label>
                      <p className="text-xs text-muted-foreground mb-2">Add links to detailed case studies or documentation</p>
                      <div className="space-y-2">
                        {(projectForm.case_study_urls || [""]).map((url, index) => (
                          <div key={index} className="flex gap-2">
                            <Input 
                              value={url} 
                              onChange={(e) => {
                                const newUrls = [...(projectForm.case_study_urls || [""])];
                                newUrls[index] = e.target.value;
                                setProjectForm({ ...projectForm, case_study_urls: newUrls });
                              }} 
                              placeholder={`Case study URL ${index + 1}`}
                            />
                            {(projectForm.case_study_urls?.length || 0) > 1 && (
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  const newUrls = (projectForm.case_study_urls || []).filter((_, i) => i !== index);
                                  setProjectForm({ ...projectForm, case_study_urls: newUrls.length > 0 ? newUrls : [""] });
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {(projectForm.case_study_urls?.length || 0) < 4 && (
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const currentUrls = projectForm.case_study_urls || [""];
                              setProjectForm({ ...projectForm, case_study_urls: [...currentUrls, ""] });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Case Study URL
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="challenge">Challenges Faced</Label>
                      <Textarea 
                        id="challenge"
                        value={projectForm.challenge || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })} 
                        placeholder="Describe the main challenges encountered during the project..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="outcome">Outcomes & Results</Label>
                      <Textarea 
                        id="outcome"
                        value={projectForm.outcome || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, outcome: e.target.value })} 
                        placeholder="What were the results? Include metrics, user feedback, or impact..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {!canSubmitProject && (
                  <span className="text-destructive">* Title and description are required</span>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => { setEditingProject(null); resetForm(); }}
                  disabled={addProject.isPending || updateProject.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmitProject || addProject.isPending || updateProject.isPending}
                >
                  {(addProject.isPending || updateProject.isPending) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {editingProject === "new" ? "Create Project" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
  );
};

export default Projects;