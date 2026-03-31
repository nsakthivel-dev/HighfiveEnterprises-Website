import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <Card className="h-full rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 group overflow-hidden relative shadow-sm hover:shadow-2xl hover:shadow-primary/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      
      <CardHeader className="p-8 pb-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold font-heading mb-3 group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground font-light leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 pt-0 relative z-10">
        <div className="h-px bg-gradient-to-r from-border via-border to-transparent mb-8" />
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
              <CheckCircle2 className="w-5 h-5 text-primary/60 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          className="w-full h-12 rounded-xl group/btn font-bold transition-all hover:bg-primary hover:text-primary-foreground"
          data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          Explore Solution
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
