import FeaturedProjects from "../FeaturedProjects";

export default function FeaturedProjectsExample() {
  const project1 = "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop";
  const project2 = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop";
  const project3 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop";

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
