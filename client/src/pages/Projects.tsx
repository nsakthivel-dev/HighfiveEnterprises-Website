import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

type ApiProject = { 
  id: string; 
  title: string; 
  description?: string | null; 
  image_url?: string | null; 
  thumbnail_url?: string | null;
  project_photos?: string[] | null;
  status?: string | null; 
  url?: string | null;
  category?: string | null;
  tech_stack?: string[] | { frontend?: string[]; backend?: string[]; database?: string[]; other?: string[] } | null;
  tagline?: string | null;
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: apiProjects = [], isLoading, isError } = useQuery<ApiProject[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const r = await fetch("/api/projects");
      if (!r.ok) throw new Error("Failed to load projects");
      return r.json();
    },
  });

  const fallbacks = [
    "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
  ];
  const projects = useMemo(() => apiProjects.map((p, i) => {
    // Extract tech stack - handle both array and object formats
    let techStack: string[] = [];
    if (p.tech_stack) {
      if (Array.isArray(p.tech_stack)) {
        techStack = p.tech_stack;
      } else if (typeof p.tech_stack === 'object') {
        const ts = p.tech_stack as any;
        techStack = [
          ...(ts.frontend || []),
          ...(ts.backend || []),
          ...(ts.database || []),
          ...(ts.other || [])
        ];
      }
    }

    // Determine status
    const status = p.status?.toLowerCase() === 'completed' 
      ? 'completed' 
      : (p.status?.toLowerCase() === 'in progress' || p.status?.toLowerCase() === 'active-maintenance' || p.status?.toLowerCase() === 'active')
        ? 'active'
        : 'active';

    // Get image - prefer thumbnail_url, then image_url, then project_photos[0], then fallback
    const image = p.thumbnail_url || p.image_url || p.project_photos?.[0] || fallbacks[i % fallbacks.length];

    return {
      id: p.id,
      title: p.title,
      description: p.description ?? p.tagline ?? "",
      image: image,
      techStack: techStack,
      status: status as 'completed' | 'active',
      progress: undefined,
      category: p.category || "General",
      caseStudy: undefined,
      url: p.url,
    };
  }), [apiProjects]);

  // Extract unique categories from projects
  const categories = useMemo(() => {
    const uniqueCategories = new Set(apiProjects.map(p => p.category || "General").filter(Boolean));
    return ["all", ...Array.from(uniqueCategories).sort()];
  }, [apiProjects]);
  
  const statuses = ["all", "active", "completed"];

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful digital solutions and transformative projects
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {isLoading && (
          <div className="text-center text-muted-foreground">Loading projects…</div>
        )}
        {isError && (
          <div className="text-center text-destructive">Failed to load projects</div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground self-center">Status:</span>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                data-testid={`filter-status-${status}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <Badge variant="outline">Click cards to view project details</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              {...project} 
              projectUrl={`/project/${project.id}`}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No projects match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
