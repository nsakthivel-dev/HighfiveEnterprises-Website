import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  status: "active" | "completed";
  progress?: number;
  category: string;
  projectUrl?: string;
  caseStudy?: {
    problem: string;
    solution: string;
    result: string;
  };
}

export default function ProjectCard({
  title,
  description,
  image,
  techStack,
  status,
  progress,
  category,
  caseStudy,
  projectUrl,
}: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (projectUrl) {
      setLocation(projectUrl);
    } else if (caseStudy) {
      // For case study flip functionality (backward compatibility)
      return;
    }
  };

  return (
    <Card
      className="hover-elevate transition-all duration-300 cursor-pointer overflow-hidden group bg-white dark:bg-card shadow-sm hover:shadow-xl border-0"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-project-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-0">
        {/* Enhanced Cover Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <div className="relative h-64 overflow-hidden">
            {/* Project Image with angled effect */}
            <div 
              className="absolute inset-0 transform transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05) rotate(-1deg)' : 'scale(1) rotate(0deg)',
              }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Status Badge - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <Badge 
                variant={status === "completed" ? "default" : "secondary"}
                className="shadow-lg backdrop-blur-sm"
              >
                {status === "completed" ? "Completed" : status === "active" ? "Active" : "In Progress"}
              </Badge>
            </div>

            {/* External Link Icon - Top Left */}
            {projectUrl && (
              <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-white dark:bg-card">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          {/* Category Badge */}
          <Badge variant="outline" className="mb-4 text-xs">
            {category}
          </Badge>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>

          {/* Progress Bar (if active and progress provided) */}
          {status === "active" && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Tech Stack */}
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {techStack.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{techStack.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Click indicator */}
          {projectUrl && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>Click to view details</span>
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
