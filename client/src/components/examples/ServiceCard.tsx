import ServiceCard from "../ServiceCard";
import { Code2 } from "lucide-react";

export default function ServiceCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ServiceCard
        icon={<Code2 className="w-6 h-6" />}
        title="Web Development"
        description="Custom web applications built with modern technologies"
        features={[
          "Responsive design for all devices",
          "Fast performance optimization",
          "SEO-friendly architecture",
          "Scalable and maintainable code",
        ]}
      />
    </div>
  );
}
