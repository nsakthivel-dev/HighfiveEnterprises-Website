import ServiceCard from "@/components/ServiceCard";
import ComparisonTable from "@/components/ComparisonTable";
import { Code2, Palette, Rocket, Layers, Shield, Zap, Globe, Cpu, ArrowRight, Sparkles, LayoutPanelTop, Network, Fingerprint } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type ApiService = {
  id: string;
  title: string;
  description?: string | null;
  features?: string[] | null;
  icon?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

export default function WhatWeDo() {
  const { data: apiServices, isError } = useQuery<ApiService[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const r = await fetch("/api/services");
      if (!r.ok) throw new Error("Failed to load services");
      return r.json();
    },
  });

  const iconMap: Record<string, JSX.Element> = {
    Code2: <Code2 className="w-8 h-8" />,
    Palette: <Palette className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />,
    Layers: <Layers className="w-8 h-8" />,
    Shield: <Shield className="w-8 h-8" />,
    Zap: <Zap className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    Cpu: <Cpu className="w-8 h-8" />,
  };

  const fallback = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Web Development",
      description: "Enterprise-grade web applications built with modern frameworks like React and Next.js.",
      features: ["Scalable architectures", "Responsive design", "SEO optimization", "API integration"],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "User-centric designs that prioritize intuitive experiences and brand identity.",
      features: ["Interactive prototyping", "User journey mapping", "Modern aesthetics", "Design systems"],
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI Solutions",
      description: "Leveraging machine learning to automate processes and provide intelligent insights.",
      features: ["LLM integration", "Data analytics", "Predictive modeling", "Custom AI agents"],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security Audits",
      description: "Comprehensive security checks to ensure your data and users are safe.",
      features: ["Penetration testing", "Vulnerability scanning", "Compliance audits", "Code review"],
    },
  ];

  const services = useMemo(() => {
    const data = apiServices || [];
    if (isError || data.length === 0) return fallback;
    return data
      .filter((s) => s.is_active)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((s) => ({
        icon: iconMap[s.icon || ""] || <Code2 className="w-8 h-8" />,
        title: s.title || "Untitled Service",
        description: s.description ?? "",
        features: s.features ?? [],
      }));
  }, [apiServices, isError]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Hero Section */}
      <section className="relative py-48 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.08),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.05),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Our Capabilities</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold mb-10 tracking-tighter font-heading leading-[0.9]">
              Engineering <br /> <span className="text-primary italic">Excellence.</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed mb-12">
              We don't just build software; we engineer digital ecosystems that empower growth, security, and innovation for the world's most ambitious brands.
            </p>
            <div className="flex gap-4">
               <div className="h-px w-24 bg-primary mt-4 opacity-50" />
               <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Expertise across the stack</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section: Refined Grid */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">Core Solutions</h2>
              <p className="text-xl text-muted-foreground font-light max-w-xl">
                Comprehensive services designed to take your digital presence from concept to industry leader.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border mx-12 mb-6" />
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold font-heading">99%</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-heading">24/7</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={`${service.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section: Redesigned for Visibility and Impact */}
      <section className="py-40 px-6 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
              Flexible Packages
            </div>
            <h2 className="text-5xl md:text-7xl font-bold font-heading tracking-tight">Choose Your Velocity</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Transparent, scalable pricing designed to grow alongside your business. No hidden fees, just pure value.
            </p>
          </div>

          <div className="w-full">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* Mature Feature Highlight */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-primary">Technical Excellence</h3>
                <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">The Lupus Advantage</h2>
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: LayoutPanelTop, title: "Bespoke Architectures", desc: "Every solution is custom-built for your specific operational needs." },
                  { icon: Network, title: "Global Scalability", desc: "Edge-first infrastructure that performs flawlessly in every corner of the world." },
                  { icon: Fingerprint, title: "Zero-Trust Security", desc: "Security isn't an afterthought; it's baked into every line of code we write." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-square rounded-[4rem] bg-gradient-to-br from-card to-secondary/50 border border-border p-12 overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                <div className="h-full w-full flex items-center justify-center">
                   <div className="relative w-48 h-48">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-6 border-2 border-dashed border-primary/40 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Rocket className="w-16 h-16 text-primary animate-pulse" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Inquiry CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 md:p-24 rounded-[4rem] bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.15),transparent_50%)]" />
            
            <div className="relative z-10 text-left space-y-6 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-bold font-heading tracking-tight leading-tight">Ready to build something iconic?</h3>
              <p className="text-xl text-primary-foreground/80 font-light">Our team of engineers and designers is ready to transform your vision into a market-leading reality.</p>
            </div>
            
            <div className="relative z-10">
              <Link href="/reach-us">
                <Button size="lg" variant="secondary" className="h-20 px-12 text-2xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all">
                  Start Project
                  <ArrowRight className="w-8 h-8 ml-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
