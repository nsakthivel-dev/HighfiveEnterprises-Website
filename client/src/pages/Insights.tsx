import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Lightbulb, Sparkles, X, Cpu, Globe, Zap, Shield } from "lucide-react";

interface InsightGoal {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
  bg: string;
  delay: number;
  floatingProps: {
    duration: number;
    xRange: [number, number];
    yRange: [number, number];
  };
}

export default function Insights() {
  const [selectedGoal, setSelectedGoal] = useState<InsightGoal | null>(null);

  const futureGoals: InsightGoal[] = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "AI Engine 'Aether'",
      description: "We're cooking a proprietary AI framework designed for seamless enterprise integration.",
      details: [
        "Natural Language Interface for legacy databases",
        "Automated workflow optimization",
        "Edge computing support for real-time processing",
        "Privacy-first architecture with local LLM support"
      ],
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      delay: 0.1,
      floatingProps: { duration: 8, xRange: [-20, 20], yRange: [-30, 30] }
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Next-Gen Infrastructure",
      description: "Reimagining how businesses scale with serverless-first architectural patterns.",
      details: [
        "Global edge delivery network integration",
        "Self-healing system architectures",
        "Micro-frontend orchestration at scale",
        "Advanced CI/CD automation for zero-downtime"
      ],
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      delay: 0.2,
      floatingProps: { duration: 10, xRange: [20, -20], yRange: [30, -30] }
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach 2026",
      description: "Expanding our digital footprint to support businesses across 5 continents.",
      details: [
        "Localized data centers for compliance",
        "Multi-lingual support teams (24/7)",
        "Strategic partnerships with regional tech hubs",
        "Community-driven development programs"
      ],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      delay: 0.3,
      floatingProps: { duration: 12, xRange: [-30, 30], yRange: [20, -20] }
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Zero-Trust Security",
      description: "Developing robust security layers that move faster than modern threats.",
      details: [
        "Biometric authentication integrations",
        "Blockchain-based audit logs",
        "Real-time threat detection and mitigation",
        "Automated compliance reporting (SOC2/HIPAA)"
      ],
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      delay: 0.4,
      floatingProps: { duration: 9, xRange: [30, -30], yRange: [-20, 20] }
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation Lab",
      description: "A dedicated space for experimental R&D in emerging technologies.",
      details: [
        "Quantum computing explorations",
        "Web3 decentralized applications",
        "Mixed reality enterprise tools",
        "Bio-metric data security"
      ],
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      delay: 0.5,
      floatingProps: { duration: 11, xRange: [-25, 25], yRange: [25, -25] }
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] md:text-sm font-semibold text-primary uppercase tracking-widest">What's Cooking</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight font-heading leading-tight">
              Future <span className="text-primary">Insights</span>
            </h1>
            <p className="text-base md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-4">
              Peek into our laboratory where we're building the tools of tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3D Carousel Section */}
      <section className="relative py-16 md:py-24 px-6 min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center overflow-visible z-10">
        <div className="carousel-3d-container w-full flex justify-center h-[300px] md:h-[400px] mb-12 md:mb-20">
          <div className="carousel-3d-inner w-[180px] h-[260px] md:w-[260px] md:h-[340px]">
            {futureGoals.map((goal, index) => {
              const rotation = index * (360 / futureGoals.length);
              return (
                <div 
                  key={index}
                  className="carousel-3d-card w-[170px] h-[240px] md:w-[240px] md:h-[320px] left-[5px] md:left-[10px] top-[5px] md:top-[10px] rounded-[1.5rem] md:rounded-[2rem] border border-border bg-card/40 backdrop-blur-xl overflow-hidden cursor-pointer group hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-primary/10"
                  style={{ 
                    transform: `rotateY(-${rotation}deg) translateZ(var(--translate-z))`,
                  }}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="h-[55%] md:h-[60%] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center p-6 md:p-8 group-hover:scale-105 transition-transform duration-500">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl ${goal.bg} ${goal.color} flex items-center justify-center shadow-lg`}>
                      {React.cloneElement(goal.icon as React.ReactElement, { className: "w-6 h-6 md:w-8 md:h-8" })}
                    </div>
                  </div>
                  <div className="h-[45%] md:h-[40%] p-4 md:p-6 flex flex-col justify-center text-center">
                    <div className={`text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2 ${goal.color}`}>{goal.title}</div>
                    <div className="text-[11px] md:text-sm text-muted-foreground leading-relaxed line-clamp-2 font-light">
                      {goal.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal for Details */}
      <AnimatePresence>
        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-background/80"
            onClick={() => setSelectedGoal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card border border-border w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setSelectedGoal(null)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className={`w-20 h-20 shrink-0 rounded-2xl ${selectedGoal.bg} ${selectedGoal.color} flex items-center justify-center shadow-lg`}>
                  {selectedGoal.icon}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{selectedGoal.title}</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    {selectedGoal.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Core Focus Areas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedGoal.details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50"
                    >
                      <Zap className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vision Statement */}
      <section className="py-32 px-6 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 font-heading">Our Commitment</h2>
            <p className="text-2xl md:text-3xl italic text-foreground font-light leading-relaxed">
              "We're not just predicting the future; we're architecting it. Every line of code we write today is a bridge to the innovations of 2026."
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
