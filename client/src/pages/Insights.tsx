import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Target, Lightbulb, TrendingUp, Sparkles, ArrowRight, X, Cpu, Globe, Zap, Shield } from "lucide-react";

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
      <section className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">What's Cooking</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight font-heading">
              Future <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Peek into our laboratory where we're building the tools of tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Cards Section */}
      <section className="relative py-24 px-6 min-h-[600px] flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {futureGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: goal.floatingProps.xRange,
                  y: goal.floatingProps.yRange,
                }}
                transition={{
                  x: {
                    duration: goal.floatingProps.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: goal.floatingProps.duration * 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.5, delay: goal.delay },
                  scale: { duration: 0.5, delay: goal.delay }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  zIndex: 20,
                  transition: { duration: 0.2 }
                }}
                onClick={() => setSelectedGoal(goal)}
                className="cursor-pointer group relative"
              >
                <div className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-primary/10 flex flex-col items-center text-center h-full">
                  <div className={`w-16 h-16 rounded-2xl ${goal.bg} ${goal.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {goal.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{goal.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light mb-6 line-clamp-3">
                    {goal.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 bg-primary/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
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
