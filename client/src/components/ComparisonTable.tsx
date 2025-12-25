import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

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
      description: "Perfect for small businesses looking to establish their online presence",
      features: [
        { name: "3 Website Pages", included: true },
        { name: "Portfolio Section", included: true },
        { name: "Basic Analytics", included: true },
        { name: "2 Logo Concepts", included: true },
        { name: "Business Card Mockup", included: true },
        { name: "Marketing (5 Days)", included: true },
        { name: "2 Platforms", included: true },
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
      description: "Ideal for growing businesses that need comprehensive digital solutions",
      is_recommended: true,
      features: [
        { name: "7 Website Pages", included: true },
        { name: "Portfolio & Blog Section", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "3 Logo Concepts", included: true },
        { name: "Business Card & Letterhead", included: true },
        { name: "Social Media Kit", included: true },
        { name: "Marketing (10 Days)", included: true },
        { name: "3 Platforms", included: true },
        { name: "Content Management System", included: true },
        { name: "Priority Support", included: false },
      ],
      is_active: true,
    },
    {
      id: "3",
      name: "Enterprise",
      price: "$10,000+",
      description: "For large organizations requiring custom solutions and ongoing support",
      features: [
        { name: "Unlimited Pages", included: true },
        { name: "Full Website & Blog", included: true },
        { name: "Advanced Analytics & Reporting", included: true },
        { name: "5 Logo Concepts", included: true },
        { name: "Complete Brand Identity Kit", included: true },
        { name: "Social Media & Marketing Kit", included: true },
        { name: "Marketing (15 Days)", included: true },
        { name: "5 Platforms", included: true },
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
          <CardContent className="space-y-6">
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
            <div className="pt-4">
              <Link href={`/contact?package=${encodeURIComponent(pkg.name)}`}>
                <Button
                  variant={pkg.is_recommended ? "default" : "outline"}
                  className="w-full"
                  data-testid={`button-select-${pkg.name.toLowerCase()}`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}