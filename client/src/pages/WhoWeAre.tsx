"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Sparkles, 
  Zap, 
  MessageCircle,
  Rocket,
  Target,
  RefreshCw,
  Ear,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WhoWeAre() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const values = [
    {
      icon: Target,
      title: "Build What Matters",
      description: "We prioritize clarity, simplicity, and meaningful outcomes that drive real business value.",
      delay: 0.1
    },
    {
      icon: MessageCircle,
      title: "Be Transparent",
      description: "Honest, clear communication at every step. No surprises, just partnership.",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Move Fast, Improve Faster",
      description: "Rapid iteration and continuous improvement without sacrificing quality.",
      delay: 0.3
    },
  ];

  const approach = [
    { 
      icon: Ear, 
      title: "Listen First", 
      description: "Deep understanding of your vision, users, and goals before any code is written.",
      number: "01"
    },
    { 
      icon: Lightbulb, 
      title: "Prototype Early", 
      description: "Sketch, test, refine—moving with confidence backed by real user feedback.",
      number: "02"
    },
    { 
      icon: Target, 
      title: "Build in Smart Steps", 
      description: "Complex ideas broken into manageable milestones that deliver value fast.",
      number: "03"
    },
    { 
      icon: RefreshCw, 
      title: "Iterate with Feedback", 
      description: "Real users shape the product through continuous testing and refinement.",
      number: "04"
    },
  ];

  const stats = [
    { 
      icon: TrendingUp,
      value: "24/7", 
      label: "Global Support",
    },
    { 
      icon: Target,
      value: "100%", 
      label: "Project Success",
    },
    { 
      icon: Lightbulb,
      value: "Modern", 
      label: "Tech Stack",
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Identity</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter font-heading leading-tight">
              Architects of <br />
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Digital Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              We are a collective of designers, developers, and strategists dedicated to building products that matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 border-y border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary mb-2 font-heading">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              The principles that guide every decision we make and every line of code we write.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: value.delay }}
                className="p-10 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-lg">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-32 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 font-heading leading-tight">
                A Process Built <br />
                <span className="text-primary">For Success</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed mb-12">
                We've refined our workflow to ensure maximum efficiency, transparency, and quality at every stage of development.
              </p>
              <div className="space-y-8">
                {approach.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="text-4xl font-bold text-primary/20 font-heading">{step.number}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-muted-foreground font-light">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-white/10 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Rocket className="w-32 h-32 text-primary animate-float" />
                </div>
                {/* Decorative dots */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
