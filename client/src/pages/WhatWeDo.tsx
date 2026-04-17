"use client";

import ServiceCard from "@/components/ServiceCard";
import ComparisonTable from "@/components/ComparisonTable";
import { Code2, Palette, Rocket, Layers, Shield, Zap, Globe, Cpu, ArrowRight, Sparkles, LayoutPanelTop, Network, Fingerprint } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-12 lg:col-span-7 xl:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Our Capabilities</span>
              </div>
              <h1 className="text-6xl md:text-[7rem] lg:text-[6rem] xl:text-[8rem] font-bold mb-10 tracking-tighter font-heading leading-[0.9]">
                Engineering <br /> <span className="text-primary italic">Excellence.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed mb-12 max-w-xl">
                We don't just build software; we engineer digital ecosystems that empower growth, security, and innovation for the world's most ambitious brands.
              </p>
              <div className="flex gap-4">
                 <div className="h-px w-24 bg-primary mt-4 opacity-50" />
                 <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Expertise across the stack</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:flex justify-end h-[500px] w-full col-span-12 lg:col-span-5 xl:col-span-5"
            >
               <div className="relative w-full max-w-[420px] h-full flex flex-col justify-center">
                 {/* Background glows - subtle and premium */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                 
                 {/* Center Main Card - Code Editor Mockup */}
                 <motion.div
                   animate={{ y: [-8, 8, -8] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-[10%] right-0 w-full lg:w-[380px] bg-card/60 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-40"
                   style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
                 >
                   <div className="h-12 bg-muted/40 border-b border-white/10 flex items-center px-4 gap-2">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                       <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                       <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                     </div>
                     <div className="flex-1 text-center pr-8 text-xs text-muted-foreground/80 font-mono">lupus-core.ts</div>
                   </div>
                   <div className="p-6 font-mono text-sm space-y-4 text-muted-foreground">
                     <div className="flex"><span className="text-pink-500/90 w-16">import</span> <span className="text-blue-400/90">{"{ Excellence }"}</span> <span className="text-pink-500/90 mx-2">from</span> <span className="text-green-400/90">'@lupus/core'</span>;</div>
                     <div className="flex"><span className="text-pink-500/90 w-16">const</span> <span className="text-blue-400/90">engineerFuture</span> <span className="text-foreground/80 mx-2">=</span> <span className="text-purple-400/90">async</span> () <span className="text-purple-400/90 mx-2">{"=>"}</span> {"{"}</div>
                     <div className="pl-6 text-muted-foreground/60 border-l border-white/10 ml-2">// Architecting scalable solutions</div>
                     <div className="pl-6 flex border-l border-white/10 ml-2"><span className="text-purple-400/90 w-16">await</span> <span className="text-blue-400/90">Excellence</span>.<span className="text-yellow-400/90">deploy</span>({"{ scale: 'global' }"});</div>
                     <div>{"}"};</div>
                     <div className="pt-4 flex opacity-60"><span className="text-pink-500/90 mr-2">export default</span> <span className="text-blue-400/90">engineerFuture</span>;</div>
                   </div>
                 </motion.div>

                 {/* Top Right - AI Solutions */}
                 <motion.div
                   animate={{ y: [0, -10, 0] }}
                   whileHover={{ scale: 1.05 }}
                   transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                   className="absolute top-[-10px] right-[-20px] w-56 bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-20 hover:z-50 cursor-pointer overflow-hidden"
                 >
                   <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500/80" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                     <div className="w-2 h-2 rounded-full bg-green-500/80" />
                     <span className="ml-2 text-[9px] font-mono text-muted-foreground/60">ai-engine.py</span>
                   </div>
                   <div className="p-3 font-mono text-[10px] space-y-1 text-muted-foreground">
                     <div className="flex"><span className="text-green-400 mr-2">~</span> <span className="text-foreground/80">python init_model.py</span></div>
                     <motion.div 
                       animate={{ opacity: [1, 0.5, 1] }} 
                       transition={{ duration: 2, repeat: Infinity }}
                       className="text-blue-400"
                     >
                       [OK] LLM: 175B parameters
                     </motion.div>
                     <div className="text-purple-400">[OK] Neural nets optimized</div>
                     <div className="flex"><span className="text-pink-500">_status:</span> <span className="text-green-400 ml-2">"Ready"</span></div>
                   </div>
                 </motion.div>

                 {/* Bottom Left - Web Development / UI UX */}
                 <motion.div
                   animate={{ y: [-5, 5, -5] }}
                   whileHover={{ scale: 1.05 }}
                   transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
                   className="absolute bottom-[20%] left-[-40px] w-[210px] bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-20 hover:z-50 cursor-pointer overflow-hidden"
                 >
                   <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500/80" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                     <div className="w-2 h-2 rounded-full bg-green-500/80" />
                     <span className="ml-2 text-[9px] font-mono text-muted-foreground/60">app.config.ts</span>
                   </div>
                   <div className="p-3 font-mono text-[10px] text-muted-foreground space-y-0.5">
                     <div><span className="text-pink-500">export default</span> <span className="text-yellow-400">{"{"}</span></div>
                     <div className="pl-3"><span className="text-foreground/80">framework:</span> <span className="text-green-400">"Next.js 14"</span>,</div>
                     <div className="pl-3"><span className="text-foreground/80">ui_ux:</span> <span className="text-green-400">"Custom Design"</span>,</div>
                     <div className="pl-3"><span className="text-foreground/80">architecture:</span> <span className="text-green-400">"Edge"</span></div>
                     <div><span className="text-yellow-400">{"}"}</span></div>
                   </div>
                 </motion.div>

                 {/* Bottom Right - Security Audits */}
                 <motion.div
                   animate={{ y: [0, 8, 0] }}
                   whileHover={{ scale: 1.05 }}
                   transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                   className="absolute bottom-[-15px] right-[-10px] w-[220px] bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-20 hover:z-50 cursor-pointer overflow-hidden"
                 >
                   <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-red-500/80" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                     <div className="w-2 h-2 rounded-full bg-green-500/80" />
                     <span className="ml-2 text-[9px] font-mono text-muted-foreground/60">audit.sh</span>
                   </div>
                   <div className="p-3 font-mono text-[10px] space-y-1 text-muted-foreground">
                     <div className="flex"><span className="text-green-400 mr-2">~</span> <span className="text-foreground/80">./run_security_audit</span></div>
                     <div className="text-emerald-400">✔ Zero vulnerabilities</div>
                     <div className="text-emerald-400">✔ Penetration tests passed</div>
                     <div className="text-emerald-400">✔ Enterprise grade protection</div>
                   </div>
                 </motion.div>
               </div>
            </motion.div>

            {/* --- MOBILE VISUAL LAYOUT (Stacked & Scroll Animated) --- */}
            <div className="flex lg:hidden flex-col gap-4 w-full mt-10 relative z-10 lg:col-span-5 px-2 pb-12">
              
              {/* Center Main Card - Code Editor Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="w-full bg-card/60 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-8 bg-muted/40 border-b border-white/10 flex items-center px-4 gap-1.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center pr-6 text-[10px] text-muted-foreground/80 font-mono">lupus-core.ts</div>
                </div>
                <div className="p-4 font-mono text-[11px] space-y-3 text-muted-foreground overflow-x-auto">
                  <div className="flex whitespace-nowrap"><span className="text-pink-500/90 w-10">import</span> <span className="text-blue-400/90">{"{ Excellence }"}</span> <span className="text-pink-500/90 mx-2">from</span> <span className="text-green-400/90">'@lupus/core'</span>;</div>
                  <div className="flex whitespace-nowrap"><span className="text-pink-500/90 w-10">const</span> <span className="text-blue-400/90">engineer</span> <span className="text-foreground/80 mx-2">=</span> <span className="text-purple-400/90">async</span> () <span className="text-purple-400/90 mx-2">{"=>"}</span> {"{"}</div>
                  <div className="pl-3 text-muted-foreground/60 border-l border-white/10 ml-2 whitespace-nowrap">// Architect scalable solutions</div>
                  <div className="pl-3 flex border-l border-white/10 ml-2 whitespace-nowrap"><span className="text-purple-400/90 w-10">await</span> <span className="text-blue-400/90">Excellence</span>.<span className="text-yellow-400/90">deploy</span>();</div>
                  <div>{"}"};</div>
                </div>
              </motion.div>

              {/* AI Solutions */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="w-[90%] self-end bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[9px] font-mono text-muted-foreground/60">ai-model.py</span>
                </div>
                <div className="p-3 font-mono text-[9px] space-y-1 text-muted-foreground overflow-x-auto">
                  <div className="flex whitespace-nowrap"><span className="text-green-400 mr-2">~</span> <span className="text-foreground/80">python init_model.py</span></div>
                  <div className="text-blue-400 whitespace-nowrap">[OK] LLM: 175B parameters</div>
                  <div className="text-purple-400 whitespace-nowrap">[OK] Networks optimized</div>
                  <div className="flex whitespace-nowrap"><span className="text-pink-500">_status:</span> <span className="text-green-400 ml-2">"Ready"</span></div>
                </div>
              </motion.div>

              <div className="flex gap-4 w-full">
                {/* Web Development / UI UX */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex-1 bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-[8px] font-mono text-muted-foreground/60">config.ts</span>
                  </div>
                  <div className="p-3 font-mono text-[9px] text-muted-foreground space-y-0.5 overflow-x-auto">
                    <div className="whitespace-nowrap"><span className="text-pink-500">export default</span> <span className="text-yellow-400">{"{"}</span></div>
                    <div className="pl-3 whitespace-nowrap"><span className="text-foreground/80">framework:</span> <span className="text-green-400">"Next.js"</span></div>
                    <div className="pl-3 whitespace-nowrap"><span className="text-foreground/80">ui_ux:</span> <span className="text-green-400">"Custom"</span></div>
                    <div className="whitespace-nowrap"><span className="text-yellow-400">{"}"}</span></div>
                  </div>
                </motion.div>

                {/* Security Audits */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex-1 bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="h-6 bg-muted/40 border-b border-white/5 flex items-center px-3 gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-[8px] font-mono text-muted-foreground/60">audit.sh</span>
                  </div>
                  <div className="p-3 font-mono text-[9px] space-y-1 text-muted-foreground overflow-x-auto">
                    <div className="flex whitespace-nowrap"><span className="text-green-400 mr-2">~</span> <span className="text-foreground/80">./run_scan</span></div>
                    <div className="text-emerald-400 whitespace-nowrap">✔ Zero vulns</div>
                    <div className="text-emerald-400 whitespace-nowrap">✔ Tests passed</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
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
      <section className="py-16 px-6 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-[0.3em]">
              Flexible Packages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">Choose Your Velocity</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light">
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
