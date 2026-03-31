import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

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

  const fallbackPackages: Package[] = [
    {
      id: "1",
      name: "Starter",
      price: "₹3,000",
      description: "Perfect for personal brands and small businesses.",
      features: [
        { name: "1-2 Web Pages", included: true },
        { name: "Mobile Responsive", included: true },
        { name: "Contact Form", included: true },
        { name: "1 Logo Concept", included: true },
        { name: "1 Revision", included: true },
        { name: "1 Poster Design", included: true },
        { name: "Marketing Support", included: false },
        { name: "Platform Listing", included: false },
      ],
      is_recommended: false,
      is_active: true,
    },
    {
      id: "2",
      name: "Professional",
      price: "₹6,000",
      description: "Ideal for growing startups needing custom solutions.",
      is_recommended: true,
      features: [
        { name: "3-5 Web Pages", included: true },
        { name: "Portfolio Section", included: true },
        { name: "Basic Analytics", included: true },
        { name: "2 Logo Concepts", included: true },
        { name: "Business Card Mockup", included: true },
        { name: "2 Poster Designs", included: true },
        { name: "Marketing (5 Days)", included: true },
        { name: "2 Platform Listings", included: true },
      ],
      is_active: true,
    },
    {
      id: "3",
      name: "Enterprise",
      price: "₹10,000+",
      description: "Full-scale solutions for large organizations.",
      features: [
        { name: "Custom Web App", included: true },
        { name: "Basic SEO Setup", included: true },
        { name: "Blog Setup", included: true },
        { name: "3 Logo Concepts", included: true },
        { name: "3 Revisions", included: true },
        { name: "Short Promo Video", included: true },
        { name: "Marketing (10 Days)", included: true },
        { name: "3 Platform Listings", included: true },
      ],
      is_recommended: false,
      is_active: true,
    },
  ];

  const packages = apiPackages.length > 0 ? apiPackages : fallbackPackages;

  const getIcon = (name: string) => {
    if (name === "Starter") return <Zap className="w-6 h-6" />;
    if (name === "Professional") return <Crown className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="flex"
        >
          <Card
            className={`flex flex-col w-full relative overflow-hidden transition-all duration-500 rounded-[3rem] border-2 group shadow-sm hover:shadow-2xl ${
              pkg.is_recommended 
                ? "border-primary bg-primary/5 scale-105 z-10 shadow-primary/10" 
                : "border-border/50 bg-card hover:border-primary/30"
            }`}
          >
            {pkg.is_recommended && (
              <div className="absolute top-6 right-6">
                <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest animate-pulse">
                  Best Value
                </Badge>
              </div>
            )}
            
            <CardHeader className="p-10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {getIcon(pkg.name)}
              </div>
              <CardTitle className="text-3xl font-bold font-heading mb-2">{pkg.name}</CardTitle>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold tracking-tighter">{pkg.price}</span>
                {pkg.name !== "Enterprise" && <span className="text-muted-foreground text-sm font-medium">/ start</span>}
              </div>
              {pkg.description && (
                <p className="text-muted-foreground font-light leading-relaxed text-sm">
                  {pkg.description}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="p-10 pt-0 flex flex-col flex-1">
              <div className="h-px bg-gradient-to-r from-border via-border to-transparent mb-10" />
              
              <ul className="space-y-5 mb-12 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      feature.included ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/30"
                    }`}>
                      {feature.included ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.is_recommended ? "default" : "outline"}
                className={`w-full h-14 rounded-2xl font-bold text-lg transition-all group/btn ${
                  pkg.is_recommended 
                    ? "shadow-xl shadow-primary/25 hover:shadow-primary/40" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                }`}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
