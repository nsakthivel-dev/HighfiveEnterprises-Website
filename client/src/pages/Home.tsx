import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import FeaturedProjects from "@/components/FeaturedProjects";
import ActivityFeed from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Target, Compass } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

type ApiProject = { 
  id: string; 
  title: string; 
  description?: string | null; 
  image_url?: string | null; 
  status?: string | null; 
  tech_stack?: string[] | null;
  url?: string | null;
  github_url?: string | null;
};

export default function Home() {
  const { data: apiProjects = [] } = useQuery<ApiProject[]>({
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
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  ];
  const activeProjects = apiProjects.filter(p => (p.status || "active") !== "completed");
  const featuredProjects = (activeProjects.length ? activeProjects : apiProjects)
    .slice(0, 3)
    .map((p, i) => {
      const status = p.status?.toLowerCase();
      let projectStatus: "active" | "completed" | "in-progress" = "active";
      
      if (status === 'completed') {
        projectStatus = "completed";
      } else if (status === 'in progress') {
        projectStatus = "in-progress";
      }
      
      return {
        id: p.id,
        title: p.title,
        description: p.description ?? "",
        image: p.image_url || fallbacks[i % fallbacks.length],
        status: projectStatus,
        techStack: p.tech_stack || [],
        link: p.url || "",
        github: p.github_url || "",
        featured: true,
      };
    });

  return (
    <div>
      <Hero />
      
      <StatsCounter />

      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-primary" />
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Our Motto
              </h2>
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-semibold text-foreground max-w-3xl mx-auto leading-relaxed"
            >
              "What we create today inspires tomorrow."
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full backdrop-blur-xl bg-card/50 border-primary/20 hover-elevate">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    "At our core, it's about people—customers, teams, and communities. Through fearless collaboration, cutting-edge innovation, and operational brilliance, we deliver solutions that solve today's challenges and define tomorrow's standard."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full backdrop-blur-xl bg-card/50 border-primary/20 hover-elevate">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Compass className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To inspire excellence in our industry by delivering unmatched customer experiences, championing innovation, and cultivating empowered teams.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Projects</h2>
                <Link href="/projects">
                  <Button variant="ghost" data-testid="link-view-all-projects">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <FeaturedProjects projects={featuredProjects} />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Live Activity</h2>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's turn your ideas into reality with our expert development team
          </p>
          <Link href="/contact">
            <Button size="lg" data-testid="button-cta-contact">
              Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
