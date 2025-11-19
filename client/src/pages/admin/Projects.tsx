import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import MultipleFileUpload from "@/components/MultipleFileUpload";
import { Plus, Upload, X, Edit, Trash2, ExternalLink } from 'lucide-react';

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
        },
        onError: (error: any) => {
          console.error("Failed to create project:", error);
          const errorMessage = error?.message || error?.error || 'Unknown error occurred';
          alert(`Failed to create project: ${errorMessage}\n\nCheck the console for more details.`);
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
        },
        onError: (error) => {
          console.error("Failed to update project:", error);
          alert(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
      const deleteProject = useMutation({
        mutationFn: (id: string) => api<void>(`/api/projects/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
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
      const imageInputRef = useRef<HTMLInputElement>(null);
      const videoInputRef = useRef<HTMLInputElement>(null);
      const [caseStudyUrls, setCaseStudyUrls] = useState<string[]>([""]);
      const [projectPhotos, setProjectPhotos] = useState<string[]>([]);

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

      const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
          const imageUrl = await uploadFile(file, 'image');
          setProjectForm({ ...projectForm, hero_image_url: imageUrl });
        } catch (error) {
          console.error('Image upload failed:', error);
        } finally {
          setUploadingImage(false);
        }
      };

      const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingVideo(true);
        try {
          const videoUrl = await uploadFile(file, 'video');
          setProjectForm({ ...projectForm, project_video: videoUrl });
        } catch (error) {
          console.error('Video upload failed:', error);
        } finally {
          setUploadingVideo(false);
      }
    };

  const addCaseStudyUrl = () => {
    setCaseStudyUrls([...caseStudyUrls, ""]);
  };

  const removeCaseStudyUrl = (index: number) => {
    const newUrls = caseStudyUrls.filter((_, i) => i !== index);
    setCaseStudyUrls(newUrls.length === 0 ? [""] : newUrls);
  };

  const updateCaseStudyUrl = (index: number, value: string) => {
    const newUrls = [...caseStudyUrls];
    newUrls[index] = value;
    setCaseStudyUrls(newUrls);
    setProjectForm({ ...projectForm, case_study_urls: newUrls.filter(url => url.trim() !== "") });
  };

  const addProjectPhoto = () => {
    if (projectPhotos.length < 8) {
      setProjectPhotos([...projectPhotos, ""]);
    }
  };

  const removeProjectPhoto = (index: number) => {
    const newPhotos = projectPhotos.filter((_, i) => i !== index);
    setProjectPhotos(newPhotos);
    setProjectForm({ ...projectForm, project_photos: newPhotos.filter(photo => photo.trim() !== "") });
  };

  const updateProjectPhoto = (index: number, value: string) => {
    const newPhotos = [...projectPhotos];
    newPhotos[index] = value;
    setProjectPhotos(newPhotos);
    setProjectForm({ ...projectForm, project_photos: newPhotos.filter(photo => photo.trim() !== "") });
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length && projectPhotos.length + i < 8; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const newPhotos = [...projectPhotos, data.url];
          setProjectPhotos(newPhotos);
          setProjectForm({ ...projectForm, project_photos: newPhotos.filter(photo => photo.trim() !== "") });
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
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

    console.log("Submitting project payload:", JSON.stringify(payload, null, 2));

    if (editingProject === "new") {
      addProject.mutate(payload);
    } else if (editingProject) {
      updateProject.mutate({ id: editingProject, data: payload });
    }
  };


  return (
      <AdminLayout title="Projects" description="Manage your portfolio projects and showcase your work.">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Projects</h2>
            <Button onClick={() => setEditingProject("new")}>Add Project</Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: Project) => (
              <Card key={project.id} className="p-4">
                <img src={project.thumbnail_url ?? project.project_photos?.[0] ?? "/placeholder.svg"} alt={project.title} className="rounded-md mb-4 h-40 w-full object-cover" />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  {project.status && (
                    <Badge variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}>
                      {project.status}
                    </Badge>
                  )}
                </div>
                {project.tagline && (
                  <p className="text-sm font-medium text-muted-foreground mb-2">{project.tagline}</p>
                )}
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                {project.category && (
                  <div className="text-xs text-muted-foreground mb-2">
                    <span className="font-medium">Category:</span> {project.category}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mb-4">{project.tech_stack?.join(", ")}</div>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditingProject(project.id); 
                    setProjectForm(project);
                    setCaseStudyUrls(project.case_study_urls?.length ? project.case_study_urls : [""]);
                    setProjectPhotos(project.project_photos?.length ? project.project_photos : []);
                  }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteProject.mutate(project.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

          {editingProject && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingProject(null)}>
              <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{editingProject === "new" ? "Add New Project" : "Edit Project"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Fill in the project details below</p>
                </div>
                <div className="flex items-center gap-2">
                  {editingProject !== "new" && (
                    <Badge variant="secondary" className="text-xs">
                      Editing Mode
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded"></div>
                    <h4 className="text-lg font-semibold text-foreground">Basic Information</h4>
                    <span className="text-xs text-muted-foreground">Required fields marked with *</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="project-title">Project Title <span className="text-red-500">*</span></Label>
                      <Input 
                        id="project-title" 
                        value={projectForm.title || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} 
                        placeholder="Enter project title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-tagline">Tagline</Label>
                      <Input 
                        id="project-tagline" 
                        value={projectForm.tagline || ""} 
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} 
                        placeholder="Short project tagline"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-category">Category</Label>
                      <Select 
                        value={projectForm.category || 'Web Development'} 
                        onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                      >
                        <SelectTrigger id="project-category" className="mt-1">
                          <SelectValue placeholder="Select category" />
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
                      <Label htmlFor="project-status">Status</Label>
                      <Select 
                        value={projectForm.status || 'Active Maintenance'} 
                        onValueChange={(value) => setProjectForm({ ...projectForm, status: value as any })}
                      >
                        <SelectTrigger id="project-status" className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Active Maintenance">Active Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Project Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded"></div>
                    <h4 className="text-lg font-semibold text-foreground">Project Details</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                     <Label htmlFor="project-description">Description <span className="text-red-500">*</span></Label>
                     <Textarea 
                       id="project-description" 
                       value={projectForm.description || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} 
                       placeholder="Detailed project description"
                       rows={4}
                       className="mt-1"
                     />
                   </div>
                   <div className="md:col-span-2">
                     <Label htmlFor="project-problem">Problem Statement</Label>
                     <Textarea 
                       id="project-problem" 
                       value={projectForm.problem || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })} 
                       placeholder="What problem does this project solve?"
                       rows={3}
                       className="mt-1"
                     />
                   </div>
                   <div className="md:col-span-2">
                     <Label htmlFor="project-solution">Solution Idea</Label>
                     <Textarea 
                       id="project-solution" 
                       value={projectForm.solution || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })} 
                       placeholder="How does this project solve the problem?"
                       rows={3}
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="project-key-features">Key Features (one per line)</Label>
                     <Textarea 
                       id="project-key-features" 
                       value={projectForm.key_features?.join('\n') || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, key_features: e.target.value.split('\n').filter(f => f.trim()) })} 
                       placeholder="Feature 1\nFeature 2\nFeature 3"
                       rows={3}
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="project-tech">Tech Stack (comma-separated)</Label>
                     <Input 
                       id="project-tech" 
                       value={projectForm.tech_stack?.join(", ") || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value.split(",").map(s => s.trim()).filter(s => s) })} 
                       placeholder="React, Node.js, PostgreSQL"
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="project-timeline">Timeline</Label>
                     <Input 
                       id="project-timeline" 
                       value={projectForm.timeline || ""} 
                       onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })} 
                       placeholder="Jan 2024 - Mar 2024"
                       className="mt-1"
                     />
                   </div>
                 </div>
               </div>
                {/* Team Members Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded"></div>
                    <h4 className="text-lg font-semibold text-foreground">Team Members</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teamMembers?.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <Checkbox 
                          id={`member-${member.id}`} 
                          checked={projectForm.team_members?.includes(member.id) || false} 
                          onCheckedChange={(checked) => {
                            const currentMembers = projectForm.team_members || [];
                            if (checked) {
                              setProjectForm({ ...projectForm, team_members: [...currentMembers, member.id] });
                            } else {
                              setProjectForm({ ...projectForm, team_members: currentMembers.filter(id => id !== member.id) });
                            }
                          }}
                        />
                        <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{member.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Visual Assets Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded"></div>
                    <h4 className="text-lg font-semibold text-foreground">Visual Assets <span className="text-muted-foreground text-sm font-normal">(Optional)</span></h4>
                  </div>
                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="md:col-span-2">
                      <MultipleFileUpload
                        label="Project Photos"
                        accept="image/*"
                        currentUrls={projectForm.project_photos || []}
                        onFilesUpload={(urls) => {
                          setProjectForm({ ...projectForm, project_photos: urls });
                          setProjectPhotos(urls);
                        }}
                        maxFiles={8}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Tip: The first image will be used as the project thumbnail if no thumbnail is specified.
                      </p>
                    </div>
                  </div>
                </div>
              <div className="md:col-span-2">
                <Label>Project Video <span className="text-muted-foreground text-sm">(Optional)</span></Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      value={projectForm.project_video || ""} 
                      onChange={(e) => setProjectForm({ ...projectForm, project_video: e.target.value })} 
                      placeholder="https://example.com/video.mp4"
                      className="mt-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                      className="mt-1"
                    >
                      {uploadingVideo ? "Uploading..." : "Upload Video"}
                    </Button>
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {projectForm.project_video && (
                    <p className="text-sm text-muted-foreground">
                      Video URL: <a href={projectForm.project_video} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Preview</a>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="project-hero">Hero Image URL <span className="text-muted-foreground text-sm">(Optional)</span></Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      id="project-hero" 
                      value={projectForm.hero_image_url || ""} 
                      onChange={(e) => setProjectForm({ ...projectForm, hero_image_url: e.target.value })} 
                      placeholder="https://example.com/hero.jpg"
                      className="mt-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setUploadingImage(true);
                            try {
                              const imageUrl = await uploadFile(file, 'image');
                              setProjectForm({ ...projectForm, hero_image_url: imageUrl });
                            } catch (error) {
                              console.error('Hero image upload failed:', error);
                            } finally {
                              setUploadingImage(false);
                            }
                          }
                        };
                        input.click();
                      }}
                      disabled={uploadingImage}
                      className="mt-1"
                    >
                      {uploadingImage ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {projectForm.hero_image_url && (
                    <img 
                      src={projectForm.hero_image_url} 
                      alt="Hero image preview" 
                      className="w-32 h-20 object-cover rounded border shadow-sm"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="project-thumb">Thumbnail URL <span className="text-muted-foreground text-sm">(Optional)</span></Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      id="project-thumb" 
                      value={projectForm.thumbnail_url || ""} 
                      onChange={(e) => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })} 
                      placeholder="https://example.com/thumb.jpg"
                      className="mt-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setUploadingImage(true);
                            try {
                              const imageUrl = await uploadFile(file, 'image');
                              setProjectForm({ ...projectForm, thumbnail_url: imageUrl });
                            } catch (error) {
                              console.error('Thumbnail upload failed:', error);
                            } finally {
                              setUploadingImage(false);
                            }
                          }
                        };
                        input.click();
                      }}
                      disabled={uploadingImage}
                      className="mt-1"
                    >
                      {uploadingImage ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {projectForm.thumbnail_url && (
                    <img 
                      src={projectForm.thumbnail_url} 
                      alt="Thumbnail preview" 
                      className="w-20 h-20 object-cover rounded border shadow-sm"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="project-demo">Demo URL (Optional)</Label>
                <Input 
                  id="project-demo" 
                  value={projectForm.demo_url || ""} 
                  onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })} 
                  placeholder="https://demo.your-project.com"
                />
              </div>
              <div>
                <Label htmlFor="project-github">GitHub URL</Label>
                <Input 
                  id="project-github" 
                  value={projectForm.github_url || ""} 
                  onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} 
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Case Study URLs (3-4 URLs)</Label>
                <div className="space-y-2">
                  {caseStudyUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={url} 
                        onChange={(e) => updateCaseStudyUrl(index, e.target.value)} 
                        placeholder={`https://case-study-${index + 1}.com`}
                      />
                      {caseStudyUrls.length > 1 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => removeCaseStudyUrl(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {caseStudyUrls.length < 4 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={addCaseStudyUrl}
                    >
                      Add Case Study URL
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-muted/50 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {editingProject === "new" ? "Creating new project" : "Editing project"}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingProject(null)}
                  disabled={(editingProject === "new" ? addProject.isPending : updateProject.isPending)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmitProject || (editingProject === "new" ? addProject.isPending : updateProject.isPending)}
                >
                  {(editingProject === "new" ? addProject.isPending : updateProject.isPending) ? (
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
          </div>
        </div>
      </div>
    )}
  </AdminLayout>
);
};

export default Projects;