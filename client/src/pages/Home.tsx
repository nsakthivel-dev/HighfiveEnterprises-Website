"use client";

import React, { useRef, useState, useEffect } from "react";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layout,
  Code2,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const bentoFeatures = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "High Performance",
    highlight: "99.9%",
    description: "Blazing fast load times and smooth interactions.",
    className: "md:col-span-1 md:row-span-2 bg-primary/5 border-primary/10 hover:border-primary/30",
    delay: 0.1,
    color: "primary",
    large: true
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure",
    description: "Built-in data protection.",
    className: "md:col-span-1 md:row-span-1 bg-secondary/50 border-border/50 hover:border-primary/30",
    delay: 0.2,
    color: "primary"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Scalable",
    highlight: "Cloud",
    description: "Grows with your business needs.",
    className: "md:col-span-1 md:row-span-2 bg-cyan-500/5 border-cyan-500/10 hover:border-cyan-500/30",
    delay: 0.3,
    color: "cyan-600",
    large: true
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal Oriented",
    description: "Focused on your objectives.",
    className: "md:col-span-1 md:row-span-1 bg-secondary/50 border-border/50 hover:border-primary/30",
    delay: 0.4,
    color: "primary"
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "UI/UX Design",
    highlight: "Custom",
    description: "Pixel-perfect interfaces tailored to your brand.",
    className: "md:col-span-2 md:row-span-1 bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
    delay: 0.5,
    color: "amber-600",
    large: true
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Modern Tech",
    description: "Latest reliable technology.",
    className: "md:col-span-1 md:row-span-1 bg-secondary/50 border-border/50 hover:border-primary/30",
    delay: 0.6,
    color: "primary"
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: "Cloud Native",
    highlight: "VPC",
    description: "Modern cloud architecture.",
    className: "md:col-span-1 md:row-span-1 bg-violet-500/5 border-violet-500/10 hover:border-violet-500/30",
    delay: 0.7,
    color: "violet-600"
  },
  {
    icon: <ArrowRight className="w-6 h-6" />,
    title: "Global Edge",
    highlight: "CDN",
    description: "Fast delivery anywhere.",
    className: "md:col-span-1 md:row-span-1 bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30",
    delay: 0.8,
    color: "blue-600"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Powered",
    highlight: "Smart",
    description: "Next-gen intelligent solutions.",
    className: "md:col-span-1 md:row-span-1 bg-fuchsia-500/5 border-fuchsia-500/10 hover:border-fuchsia-500/30",
    delay: 0.9,
    color: "fuchsia-600"
  }
];

function FeatureCard({ feature }: { feature: typeof bentoFeatures[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: feature.delay }}
      className={`group relative rounded-[1.5rem] border p-4 md:p-5 transition-all duration-700 hover:shadow-2xl overflow-hidden flex flex-col justify-between ${feature.className}`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#fff_1px,transparent_1px),linear-gradient(150deg,#fff_1px,transparent_1px)] bg-[size:20px_20px] animate-shimmer" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <motion.div 
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 text-${feature.color} shadow-lg shadow-black/5`}
        >
          {React.cloneElement(feature.icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
        </motion.div>
        
        <div className="space-y-2 mt-auto pb-2">
          {feature.highlight && (
            <div className={`text-2xl md:text-3xl font-bold tracking-tighter text-${feature.color} opacity-80 mb-0.5`}>
              {feature.highlight}
            </div>
          )}
          <h4 className={`font-bold tracking-tight group-hover:text-primary transition-colors duration-300 ${feature.large ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
            {feature.title}
          </h4>
          <p className={`text-muted-foreground leading-relaxed font-light group-hover:text-foreground transition-colors duration-500 ${feature.large ? 'text-xs md:text-sm' : 'text-[9px] md:text-[11px]'}`}>
            {feature.description}
          </p>
        </div>
      </div>

      {/* Dynamic Border Beam Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-border-beam" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-border-beam delay-1000" />
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--glow-rgb),0.1),transparent_80%)]" 
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
        }}
      />
      
      <style>{`
        @keyframes border-beam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-border-beam {
          animation: border-beam 3s infinite linear;
        }
        .group:hover {
          --glow-rgb: ${feature.color === 'primary' ? '99, 102, 241' : 
                        feature.color === 'indigo-500' ? '79, 70, 229' : 
                        feature.color === 'cyan-500' ? '6, 182, 212' : 
                        feature.color === 'emerald-500' ? '16, 185, 129' :
                        feature.color === 'rose-500' ? '244, 63, 94' :
                        feature.color === 'violet-500' ? '139, 92, 246' :
                        feature.color === 'blue-500' ? '59, 130, 246' :
                        feature.color === 'fuchsia-500' ? '217, 70, 239' :
                        '245, 158, 11'};
        }
      `}</style>
    </motion.div>
  );
}

export default function Home() {
  const mottoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mottoRef,
    offset: ["start end", "end start"]
  });

  const mottoScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const mottoOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div className="bg-background">
      <Hero />
      
      <StatsCounter />

      {/* Innovative Motto Section */}
      <section ref={mottoRef} className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            style={{ scale: mottoScale, opacity: mottoOpacity }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Our Philosophy
            </div>
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight font-heading">
              "What we create today <br />
              <span className="text-primary italic">inspires tomorrow.</span>"
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-24 pb-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-primary/50" />
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Core Capabilities</h3>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold font-heading tracking-tight"
            >
              Built for the <br />
              <span className="text-primary italic">modern web.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[185px] grid-flow-dense">
            {bentoFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision: Modern Split Focus */}
      <section className="py-24 px-6 bg-secondary/20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-1 px-1 bg-border/20 rounded-[3rem] overflow-hidden border border-border/50">
            {/* Mission Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-10 md:p-16 bg-background/60 backdrop-blur-md hover:bg-background/80 transition-all duration-700"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground/60 group-hover:text-primary transition-colors duration-500">Mission</h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] text-foreground">
                  "At our core, it's about <span className="text-primary italic">people</span>. Through fearless collaboration, we deliver tomorrow's standard."
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-700" />
            </motion.div>

            {/* Vision Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-10 md:p-16 bg-background/40 backdrop-blur-md hover:bg-background/80 transition-all duration-700 border-t md:border-t-0 md:border-l border-border/50"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground/60 group-hover:text-indigo-500 transition-colors duration-500">Vision</h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] text-foreground">
                  To inspire excellence globally by delivering <span className="text-indigo-500 italic">unmatched</span> experiences in every project we touch.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[60px] group-hover:bg-indigo-500/10 transition-colors duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final Innovative CTA */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 p-16 md:p-24 rounded-[4rem] bg-primary text-primary-foreground text-center overflow-hidden group"
          >
            {/* Interactive Glow */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/20 blur-[120px] rounded-full group-hover:translate-x-1/4 group-hover:translate-y-1/4 transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter font-heading">
                Let's Build the <br /> Next Big Thing.
              </h2>
              <p className="text-xl md:text-2xl text-primary-foreground/80 font-light max-w-2xl mx-auto">
                Join visionaries worldwide who trust Lupus Venture to engineer their digital future.
              </p>
              <div className="pt-8">
                <Link href="/reach-us">
                  <Button size="lg" variant="secondary" className="h-20 px-12 text-2xl font-bold rounded-2xl group shadow-2xl hover:scale-105 transition-all">
                    Get Started
                    <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
