import ProjectCard from "../ProjectCard";

export default function ProjectCardExample() {
  const projectImage = "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop";

  return (
    <div className="p-8 max-w-sm">
      <ProjectCard
        title="E-Commerce Platform"
        description="Modern online shopping experience with real-time inventory"
        image={projectImage}
        techStack={["React", "Node.js", "MongoDB"]}
        status="completed"
        category="E-Commerce"
        caseStudy={{
          problem: "Client needed a scalable e-commerce solution to handle growing customer base",
          solution: "Built a microservices architecture with real-time inventory and payment processing",
          result: "300% increase in sales and 99.9% uptime in first year",
        }}
      />
    </div>
  );
}
