import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  status: "active" | "completed";
  progress?: number;
  category: string;
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
}: ProjectCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card
      className="hover-elevate transition-all duration-300 cursor-pointer overflow-visible group"
      onClick={() => caseStudy && setFlipped(!flipped)}
      data-testid={`card-project-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-0">
        {!flipped ? (
          <>
            <div className="relative overflow-hidden rounded-t-md">
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100" />
              <div className="absolute top-3 right-3">
                <Badge variant={status === "completed" ? "default" : "secondary"}>
                  {status === "completed" ? "Completed" : "Active"}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>

              <Badge variant="outline" className="mb-3 text-xs">
                {category}
              </Badge>

              <p className="text-sm text-muted-foreground mb-4">{description}</p>

              {status === "active" && progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 min-h-[400px] flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Case Study</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-destructive mb-1">Problem</h4>
                <p className="text-sm text-muted-foreground">{caseStudy?.problem}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Solution</h4>
                <p className="text-sm text-muted-foreground">{caseStudy?.solution}</p>
              </div>
              <div>
                <h4 className="font-semibold text-chart-3 mb-1">Result</h4>
                <p className="text-sm text-muted-foreground">{caseStudy?.result}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
