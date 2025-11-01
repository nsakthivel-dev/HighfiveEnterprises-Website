import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import FeaturedProjects from "@/components/FeaturedProjects";
import ActivityFeed from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import project1 from "@assets/generated_images/E-commerce_project_thumbnail_beaf8988.png";
import project2 from "@assets/generated_images/Mobile_app_project_thumbnail_2e2899be.png";
import project3 from "@assets/generated_images/Corporate_website_thumbnail_f78b8018.png";

export default function Home() {
  const featuredProjects = [
    {
      title: "E-Commerce Revolution",
      description: "Modern shopping platform with AI-powered recommendations and real-time inventory",
      image: project1,
    },
    {
      title: "Mobile Banking App",
      description: "Secure financial management application with biometric authentication",
      image: project2,
    },
    {
      title: "Corporate Website Redesign",
      description: "Professional online presence for enterprise clients with CMS integration",
      image: project3,
    },
  ];

  return (
    <div>
      <Hero />
      
      <StatsCounter />

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
