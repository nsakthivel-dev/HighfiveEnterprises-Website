import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  status?: "active" | "completed" | "in-progress";
  techStack?: string[];
  link?: string;
  tagline?: string;
  summary?: string;
  progress?: number;
}

interface FeaturedProjectsProps {
  projects: Project[];
}

const SECTION_COPY = {
  title: "Featured Projects",
  subtitle: "Real-time glimpse of what we're building right now",
  primaryCta: "View Project",
  secondaryCta: "View Details",
  emptyTitle: "No featured projects yet",
  emptyDescription: "We're prepping our next release. Check back soon for a fresh drop from the studio.",
};

const SLIDE_INTERVAL = 9000;

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = projects ?? [];
  const count = items.length;
  const safeIndex = count ? Math.min(currentIndex, count - 1) : 0;
  const activeProject = count ? items[safeIndex] : undefined;

  useEffect(() => {
    if (count === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex > count - 1) {
      setCurrentIndex(count - 1);
    }
  }, [count, currentIndex]);

  useEffect(() => {
    if (count <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [count]);

  const secondaryProjects = useMemo(() => {
    if (count === 0) return [];

    const visible = Math.min(4, count);
    return Array.from({ length: visible }, (_, offset) => {
      const index = (safeIndex + offset) % count;
      return { project: items[index], index };
    });
  }, [items, count, safeIndex]);

  const goToProject = (index: number) => {
    if (index < 0 || index >= count) return;
    setCurrentIndex(index);
  };

  const nextProject = () => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const prevProject = () => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  if (!activeProject) {
    return (
      <section className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-border/40 bg-card/70 p-12 text-center text-foreground shadow-lg shadow-primary/10 backdrop-blur-xl">
        <div className="mx-auto h-24 w-24 rounded-full bg-primary/15" aria-hidden />
        <h2 className="text-2xl font-semibold tracking-tight">{SECTION_COPY.emptyTitle}</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{SECTION_COPY.emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#38bdf833,transparent_55%)]" aria-hidden />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 text-foreground">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            
            <p className="mt-2 max-w-2xl text-base font-semibold sm:text-lg">
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent">
                {SECTION_COPY.subtitle}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs text-muted-foreground">
            <span>Project</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{safeIndex + 1}</span>
            <span className="text-muted-foreground/60">/</span>
            <span>{count}</span>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr),minmax(0,1fr)]">
          <Card className="flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col gap-6 p-6 sm:p-8"
            >
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                  <div className="aspect-video w-full overflow-hidden">
                    <motion.img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="h-full w-full object-cover"
                      initial={{ scale: 1.03 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.85, ease: "easeOut" }}
                    />
                  </div>
                  <Badge className="absolute left-6 top-6 bg-primary/15 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                    {(activeProject.status ?? "in-progress").replace("-", " ")}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold tracking-tight sm:text-[36px] md:text-[38px]">
                    {activeProject.title}
                  </h3>
                </div>

                {activeProject.techStack && activeProject.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeProject.techStack.slice(0, 6).map((tech, index) => (
                      <span
                        key={`${activeProject.title}-tech-${tech}-${index}`}
                        className="rounded-full border border-border/50 bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
                  >
                    <a
                      href={activeProject.link ?? (activeProject.id ? `/project/${activeProject.id}` : "#")}
                      target={activeProject.link ? "_blank" : undefined}
                      rel={activeProject.link ? "noopener noreferrer" : undefined}
                      aria-label={`${SECTION_COPY.primaryCta} for ${activeProject.title}`}
                    >
                      {SECTION_COPY.primaryCta}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-full border border-border bg-background/40 px-6 py-2 text-sm font-semibold text-foreground transition hover:bg-background/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                  >
                    <a
                      href={activeProject.id ? `/project/${activeProject.id}` : activeProject.link ?? "#"}
                      aria-label={`${SECTION_COPY.secondaryCta} for ${activeProject.title}`}
                    >
                      {SECTION_COPY.secondaryCta}
                    </a>
                  </Button>
                </div>
            </motion.div>
          </AnimatePresence>
        </Card>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Up next</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevProject}
                  className="h-9 w-9 rounded-full border-border bg-card/70 text-foreground transition hover:bg-card/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                  disabled={count <= 1}
                  aria-label="Previous project"
                  data-testid="button-prev-project"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextProject}
                  className="h-9 w-9 rounded-full border-border bg-card/70 text-foreground transition hover:bg-card/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                  disabled={count <= 1}
                  aria-label="Next project"
                  data-testid="button-next-project"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {secondaryProjects.map(({ project, index }) => {
                const isActive = index === safeIndex;

                return (
                  <button
                    key={project.id ?? `${project.title}-${index}`}
                    onClick={() => goToProject(index)}
                    onFocus={() => goToProject(index)}
                    className={`group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 text-left transition hover:-translate-y-1 hover:bg-card/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border ${
                      isActive ? "ring-2 ring-primary/40" : ""
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-border/50">
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div>
                        <Badge className="mb-1 w-fit bg-primary/10 text-[9px] font-medium uppercase tracking-[0.28em] text-primary">
                          {(project.status ?? "in-progress").replace("-", " ")}
                        </Badge>
                        <p className="text-sm font-semibold text-foreground">{project.title}</p>
                      </div>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span key={`${project.title}-mini-tech-${tech}`} className="rounded-full border border-border/60 px-2 py-0.5">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-xs text-muted-foreground">
              <span>Use arrow keys or thumbnails to switch projects</span>
              <div className="flex items-center gap-1">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToProject(index)}
                    className={`h-2 w-6 rounded-full transition ${
                      index === safeIndex ? "bg-primary" : "bg-muted hover:bg-muted/80"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                    data-testid={`button-dot-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
