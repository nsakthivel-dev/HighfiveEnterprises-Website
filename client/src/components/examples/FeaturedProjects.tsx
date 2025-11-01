import FeaturedProjects from "../FeaturedProjects";
import project1 from "@assets/generated_images/E-commerce_project_thumbnail_beaf8988.png";
import project2 from "@assets/generated_images/Mobile_app_project_thumbnail_2e2899be.png";
import project3 from "@assets/generated_images/Corporate_website_thumbnail_f78b8018.png";

export default function FeaturedProjectsExample() {
  const projects = [
    {
      title: "E-Commerce Revolution",
      description: "Modern shopping platform with AI recommendations",
      image: project1,
    },
    {
      title: "Mobile Banking App",
      description: "Secure financial management on the go",
      image: project2,
    },
    {
      title: "Corporate Website",
      description: "Professional online presence for enterprises",
      image: project3,
    },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <FeaturedProjects projects={projects} />
    </div>
  );
}
