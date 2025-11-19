import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PackageFeature {
  name: string;
  included: boolean;
}

interface Package {
  id: string;
  name: string;
  price: string;
  description?: string | null;
  features: PackageFeature[];
  is_recommended: boolean;
  is_active: boolean;
}

export default function ComparisonTable() {
  const { data: apiPackages = [] } = useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to load packages");
      return res.json();
    },
  });

  // Fallback packages if no data from API
  const fallbackPackages: Package[] = [
    {
      id: "1",
      name: "Starter",
      price: "$2,500",
      features: [
        { name: "Responsive Design", included: true },
        { name: "Up to 5 Pages", included: true },
        { name: "Basic SEO", included: true },
        { name: "Content Management", included: false },
        { name: "Custom Integrations", included: false },
        { name: "Priority Support", included: false },
      ],
      is_recommended: false,
      is_active: true,
    },
    {
      id: "2",
      name: "Professional",
      price: "$5,000",
      is_recommended: true,
      features: [
        { name: "Responsive Design", included: true },
        { name: "Up to 15 Pages", included: true },
        { name: "Advanced SEO", included: true },
        { name: "Content Management", included: true },
        { name: "Custom Integrations", included: true },
        { name: "Priority Support", included: false },
      ],
      is_active: true,
    },
    {
      id: "3",
      name: "Enterprise",
      price: "$10,000+",
      features: [
        { name: "Responsive Design", included: true },
        { name: "Unlimited Pages", included: true },
        { name: "Advanced SEO", included: true },
        { name: "Content Management", included: true },
        { name: "Custom Integrations", included: true },
        { name: "Priority Support", included: true },
      ],
      is_recommended: false,
      is_active: true,
    },
  ];

  const packages = apiPackages.length > 0 ? apiPackages : fallbackPackages;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card
          key={pkg.id}
          className={`overflow-visible ${pkg.is_recommended ? "border-primary shadow-lg" : ""}`}
        >
          <CardHeader>
            {pkg.is_recommended && (
              <Badge className="w-fit mb-2">Recommended</Badge>
            )}
            <CardTitle className="text-2xl">{pkg.name}</CardTitle>
            <div className="text-3xl font-bold mt-2">{pkg.price}</div>
            {pkg.description && (
              <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {pkg.features.map((feature) => (
                <li key={feature.name} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? "" : "text-muted-foreground"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              variant={pkg.is_recommended ? "default" : "outline"}
              className="w-full"
              data-testid={`button-select-${pkg.name.toLowerCase()}`}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
