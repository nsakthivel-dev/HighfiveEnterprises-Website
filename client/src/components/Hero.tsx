import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/hero/hero-background.png";
import { Link } from "wouter";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-background/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 glass-morphic px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">Building the Future</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground leading-tight">
          HighFive Enterprises
        </h1>

        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
          Your trusted tech partner for innovative digital solutions, cutting-edge development, and transformative technology
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/projects">
            <Button
              size="lg"
              className="text-base"
              data-testid="button-view-projects"
            >
              View Our Work
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-background/20 backdrop-blur-sm border-white/30 text-primary-foreground hover:bg-background/30"
              data-testid="button-contact-us"
            >
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}