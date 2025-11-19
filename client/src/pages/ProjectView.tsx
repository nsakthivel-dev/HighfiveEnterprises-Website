import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

type Project = {
  id: string;
  title: string;
  tagline?: string | null;
  overview?: string | null;
  key_features?: string[] | null;
  problem?: string | null;
  solution?: string | null;
  tech_stack?: {
    frontend?: string[] | null;
    backend?: string[] | null;
    database?: string[] | null;
    other?: string[] | null;
  } | null;
  architecture?: string | null;
  role?: string | null;
  timeline?: string | null;
  outcomes?: string[] | null;
  challenges?: string[] | null;
  demo_url?: string | null;
  github_url?: string | null;
  case_study_url?: string | null;
  hero_image?: string | null;
  screenshots?: string[] | null;
  demo_video?: string | null;
  description?: string | null;
  image_url?: string | null;
  status?: string | null;
  url?: string | null;
  created_at?: string;
};

export default function ProjectView() {
  const [, params] = useRoute<{ id: string }>('/project/:id');
  const id = params?.id;
  
  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const r = await fetch(`/api/projects/${id}`);
      if (!r.ok) throw new Error('Failed to load project');
      return r.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading project</h1>
        <Link to="/projects" className="mt-4 text-primary hover:underline flex items-center">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{project.title} | HighFive Enterprises</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative">
        {(() => {
          // Try multiple hero image field names
          const heroImage = (project as any).hero_image || (project as any).hero_image_url || project.image_url || (project as any).project_photos?.[0];
          return heroImage ? (
            <div className="h-[50vh] w-full overflow-hidden">
              <img 
                src={heroImage} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ) : (
            <div className="h-[30vh] bg-gradient-to-r from-primary/20 to-secondary/20"></div>
          );
        })()}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="absolute bottom-8">
            <Link to="/projects" className="text-white hover:underline flex items-center mb-4">
              <ArrowLeft size={16} />
              <span>Back to Projects</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{project.title}</h1>
            {project.tagline && (
              <p className="text-xl text-white/90 mt-2">{project.tagline}</p>
            )}
            {project.status && (
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.status?.toLowerCase() === 'completed' ? 'bg-green-500/20 text-green-200' : 
                  project.status?.toLowerCase() === 'in progress' ? 'bg-yellow-500/20 text-yellow-200' : 
                  'bg-blue-500/20 text-blue-200'
                }`}>
                  {project.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description/Overview */}
            {(project.description || project.overview) && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-lg">{project.overview || project.description}</p>
              </section>
            )}

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.problem && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Problem</h2>
                  <p>{project.problem}</p>
                </section>
              )}
              
              {project.solution && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Solution</h2>
                  <p>{project.solution}</p>
                </section>
              )}
            </div>

            {/* Key Features */}
            {project.key_features && project.key_features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {project.key_features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    // Handle both array and JSON string formats
                    const screenshots = Array.isArray(project.screenshots) 
                      ? project.screenshots 
                      : typeof project.screenshots === 'string' 
                        ? (() => {
                            try {
                              const parsed = JSON.parse(project.screenshots);
                              return Array.isArray(parsed) ? parsed : [project.screenshots];
                            } catch {
                              return [project.screenshots];
                            }
                          })()
                        : [];
                    return screenshots.map((screenshot, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`} 
                          className="w-full h-auto"
                        />
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}
            
            {/* Project Photos */}
            {(project as any).project_photos && (project as any).project_photos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Project Photos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(project as any).project_photos.map((photo: string, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={photo} 
                        alt={`Project photo ${index + 1}`} 
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demo Video */}
            {project.demo_video && typeof project.demo_video === 'string' && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Demo</h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {project.demo_video.includes('youtube.com') || project.demo_video.includes('youtu.be') ? (
                    <iframe 
                      src={project.demo_video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title="Project Demo" 
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : project.demo_video.includes('vimeo.com') ? (
                    <iframe 
                      src={project.demo_video.replace('vimeo.com/', 'player.vimeo.com/video/')}
                      title="Project Demo" 
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <video 
                      src={project.demo_video} 
                      controls 
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </section>
            )}

            {/* Outcomes & Impact */}
            {project.outcomes && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Outcomes & Impact</h2>
                {Array.isArray(project.outcomes) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {project.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg">{project.outcomes}</p>
                )}
              </section>
            )}

            {/* Challenges & Learnings */}
            {project.challenges && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Challenges & Learnings</h2>
                {Array.isArray(project.challenges) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg">{project.challenges}</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack */}
            {project.tech_stack && (
              <section className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
                
                {(() => {
                  // Handle both object format and array format
                  if (Array.isArray(project.tech_stack)) {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 rounded text-sm">{tech}</span>
                        ))}
                      </div>
                    );
                  }
                  
                  const techStack = project.tech_stack as any;
                  return (
                    <>
                      {techStack.frontend && techStack.frontend.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm uppercase text-muted-foreground">Frontend</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {techStack.frontend.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 rounded text-sm">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {techStack.backend && techStack.backend.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm uppercase text-muted-foreground">Backend</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {techStack.backend.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 rounded text-sm">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {techStack.database && techStack.database.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm uppercase text-muted-foreground">Database</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {techStack.database.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 rounded text-sm">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {techStack.other && techStack.other.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm uppercase text-muted-foreground">Other Tools</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {techStack.other.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 rounded text-sm">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </section>
            )}

            {/* Project Details */}
            <section className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              
              {project.role && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground">My Role</h4>
                  <p className="mt-1">{project.role}</p>
                </div>
              )}
              
              {project.timeline && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground">Timeline</h4>
                  <p className="mt-1">{project.timeline}</p>
                </div>
              )}
              
              {project.architecture && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground">Architecture</h4>
                  <p className="mt-1">{project.architecture}</p>
                </div>
              )}
            </section>

            {/* Links */}
            <section className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <div className="space-y-3">
                {project.demo_url && (
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <span className="mr-2">🔗</span>
                    Live Demo
                  </a>
                )}
                
                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <span className="mr-2">💻</span>
                    GitHub Repository
                  </a>
                )}
                
                {(project.case_study_url || ((project as any).case_study_urls && (project as any).case_study_urls.length > 0)) && (
                  <>
                    {project.case_study_url && (
                      <a 
                        href={project.case_study_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <span className="mr-2">📝</span>
                        Case Study
                      </a>
                    )}
                    {(project as any).case_study_urls && (project as any).case_study_urls.map((url: string, index: number) => (
                      <a 
                        key={index}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <span className="mr-2">📝</span>
                        Case Study {index + 1}
                      </a>
                    ))}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-muted/50 to-transparent">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Share Your Feedback</h2>
              <p className="text-lg text-muted-foreground">
                We'd love to hear your thoughts about this project!
              </p>
            </div>
            <FeedbackForm projectId={id} />
          </div>
        </div>
      </section>
    </div>
  );
}