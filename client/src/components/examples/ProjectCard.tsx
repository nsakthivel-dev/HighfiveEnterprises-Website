import ProjectCard from "../ProjectCard";
import projectImage from "@assets/generated_images/E-commerce_project_thumbnail_beaf8988.png";

export default function ProjectCardExample() {
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
