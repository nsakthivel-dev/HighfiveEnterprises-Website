import FeaturedProjects from "../FeaturedProjects";
import project1 from "@assets/generated_images/E-commerce_project_thumbnail_beaf8988.png";
import project2 from "@assets/generated_images/Mobile_app_project_thumbnail_2e2899be.png";
import project3 from "@assets/generated_images/Corporate_website_thumbnail_f78b8018.png";

export default function FeaturedProjectsExample() {
  const projects = [
    {
      title: "E-Commerce Revolution",
      description: "Modern shopping platform with AI-powered product recommendations, real-time inventory management, and seamless checkout experience. Built with cutting-edge technologies for optimal performance.",
      image: project1,
      status: "active" as const,
      techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
      link: "https://example.com/ecommerce",
      github: "https://github.com/example/ecommerce",
      featured: true,
    },
    {
      title: "Mobile Banking App",
      description: "Secure financial management application with biometric authentication, real-time transaction monitoring, and intelligent spending analytics for modern banking needs.",
      image: project2,
      status: "completed" as const,
      techStack: ["React Native", "TypeScript", "Firebase", "Stripe"],
      link: "https://example.com/banking",
      github: "https://github.com/example/banking",
      featured: true,
    },
    {
      title: "Corporate Website",
      description: "Professional enterprise website with dynamic content management, multi-language support, and advanced analytics integration for global business presence.",
      image: project3,
      status: "in-progress" as const,
      techStack: ["Next.js", "Tailwind", "Strapi", "Vercel"],
      link: "https://example.com/corporate",
      featured: true,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-10">
      <FeaturedProjects projects={projects} />
    </div>
  );
}
