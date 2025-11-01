import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import project1 from "@assets/generated_images/E-commerce_project_thumbnail_beaf8988.png";
import project2 from "@assets/generated_images/Mobile_app_project_thumbnail_2e2899be.png";
import project3 from "@assets/generated_images/Corporate_website_thumbnail_f78b8018.png";
import project4 from "@assets/generated_images/SaaS_platform_thumbnail_3b96aeba.png";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern online shopping experience with AI-powered product recommendations and real-time inventory management",
      image: project1,
      techStack: ["React", "Node.js", "MongoDB", "Stripe"],
      status: "completed" as const,
      category: "E-Commerce",
      caseStudy: {
        problem: "Client needed a scalable e-commerce solution to handle growing customer base and inventory complexity",
        solution: "Built a microservices architecture with real-time inventory sync, AI recommendations, and seamless payment processing",
        result: "300% increase in sales, 99.9% uptime, and 40% improvement in customer satisfaction scores",
      },
    },
    {
      title: "Mobile Banking App",
      description: "Secure financial management application with biometric authentication and real-time transactions",
      image: project2,
      techStack: ["React Native", "Python", "PostgreSQL", "AWS"],
      status: "active" as const,
      progress: 75,
      category: "Mobile App",
      caseStudy: {
        problem: "Traditional banking app had poor UX and lacked modern security features",
        solution: "Redesigned from ground up with biometric auth, intuitive UI, and real-time fraud detection",
        result: "Currently in beta testing with 10,000+ active users and 4.8 star rating",
      },
    },
    {
      title: "Corporate Website",
      description: "Professional online presence for enterprise clients with custom CMS and multi-language support",
      image: project3,
      techStack: ["Next.js", "Tailwind", "Sanity CMS", "Vercel"],
      status: "completed" as const,
      category: "Web Development",
      caseStudy: {
        problem: "Outdated corporate website with difficult content management and poor SEO",
        solution: "Modern JAMstack architecture with headless CMS, automated SEO optimization, and CDN distribution",
        result: "5x faster load times, 200% increase in organic traffic, easy content updates for marketing team",
      },
    },
    {
      title: "SaaS Analytics Platform",
      description: "Advanced analytics dashboard with real-time data visualization and AI insights",
      image: project4,
      techStack: ["Vue.js", "Django", "Redis", "Chart.js"],
      status: "active" as const,
      progress: 60,
      category: "SaaS",
      caseStudy: {
        problem: "Company had data scattered across multiple tools with no unified analytics view",
        solution: "Centralized platform integrating all data sources with custom dashboards and AI-powered insights",
        result: "Currently processing 1M+ events daily, saving clients 15+ hours per week on reporting",
      },
    },
  ];

  const categories = ["all", "E-Commerce", "Mobile App", "Web Development", "SaaS"];
  const statuses = ["all", "active", "completed"];

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful digital solutions and transformative projects
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
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
            <Badge variant="outline">Click cards to view case studies</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No projects match your filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
