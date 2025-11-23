import ServiceCard from "@/components/ServiceCard";
import ComparisonTable from "@/components/ComparisonTable";
import { Code2, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type ApiService = {
  id: string;
  title: string;
  description?: string | null;
  features?: string[] | null;
  icon?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

export default function Services() {
  const { data: apiServices = [], isError } = useQuery<ApiService[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const r = await fetch("/api/services");
      if (!r.ok) throw new Error("Failed to load services");
      return r.json();
    },
  });

  const iconMap: Record<string, JSX.Element> = {
    Code2: <Code2 className="w-6 h-6" />,
    Palette: <Palette className="w-6 h-6" />,
  };

  const fallback = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Web Development",
      description: "We design and develop all types of websites — including static and dynamic sites.",
      features: [
        "Database-driven websites for better functionality",
        "Responsive, modern, and user-friendly designs",
        "Custom web applications development",
        "Performance optimization and maintenance",
      ],
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Logo Design",
      description: "We create unique and creative logos that perfectly represent your brand.",
      features: [
        "Custom logo designs tailored to your vision",
        "Multiple design concepts and revisions",
        "Brand identity development",
        "Full copyright ownership",
      ],
    },
  ];

  const services = useMemo(() => {
    if (isError || apiServices.length === 0) return fallback;
    return apiServices
      .filter((s) => s.is_active)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((s) => ({
        icon: iconMap[s.icon || ""] || <Code2 className="w-6 h-6" />,
        title: s.title,
        description: s.description ?? "",
        features: s.features ?? [],
      }));
  }, [apiServices, isError]);

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
    </div>
  );
}
