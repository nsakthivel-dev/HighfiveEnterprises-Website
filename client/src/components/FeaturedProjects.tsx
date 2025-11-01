import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-96">
            <img
              src={projects[currentIndex].image}
              alt={projects[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{projects[currentIndex].title}</h3>
                <p className="text-lg text-white/90">{projects[currentIndex].description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevProject}
          className="bg-background/80 backdrop-blur-sm"
          data-testid="button-prev-project"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextProject}
          className="bg-background/80 backdrop-blur-sm"
          data-testid="button-next-project"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/50"
            }`}
            data-testid={`button-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
