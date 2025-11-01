import ServiceCard from "@/components/ServiceCard";
import ComparisonTable from "@/components/ComparisonTable";
import ChatbotWidget from "@/components/ChatbotWidget";
import { Code2, Smartphone, Cloud, Palette, Database, Shield } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Web Development",
      description: "Custom web applications built with modern technologies and best practices",
      features: [
        "Responsive design for all devices",
        "Fast performance optimization",
        "SEO-friendly architecture",
        "Scalable and maintainable code",
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      features: [
        "React Native & Flutter development",
        "Native performance optimization",
        "App store submission support",
        "Ongoing maintenance and updates",
      ],
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment services",
      features: [
        "AWS, Azure, and GCP expertise",
        "DevOps and CI/CD pipelines",
        "Auto-scaling and load balancing",
        "24/7 monitoring and support",
      ],
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces that users love",
      features: [
        "User research and testing",
        "Wireframing and prototyping",
        "Design system creation",
        "Accessibility compliance",
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Database Design",
      description: "Robust database architecture and optimization services",
      features: [
        "SQL and NoSQL expertise",
        "Performance optimization",
        "Data migration services",
        "Backup and recovery strategies",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security and compliance solutions",
      features: [
        "Security audits and testing",
        "GDPR and compliance consulting",
        "Penetration testing",
        "Secure coding practices",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Service Packages</h2>
            <p className="text-lg text-muted-foreground">
              Choose the package that fits your project requirements
            </p>
          </div>
          <ComparisonTable />
        </div>
      </section>

      <ChatbotWidget />
    </div>
  );
}
