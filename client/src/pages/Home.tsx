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
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";

const bentoFeatures = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "High Performance",
    description: "Experience blazing fast load times and smooth interactions with our optimized engine. We focus on performance-first architecture to ensure your users never have to wait.",
    className: "md:col-span-2 bg-primary/5 border-primary/10 hover:border-primary/30",
    delay: 0.1,
    color: "primary"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Built-in protection for your data and users. We implement industry-standard security protocols and encryption by default.",
    className: "md:col-span-1 bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/30",
    delay: 0.2,
    color: "indigo-500"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Scalable Core",
    description: "Robust architecture that grows alongside your business needs without compromising stability.",
    className: "md:col-span-1 bg-cyan-500/5 border-cyan-500/10 hover:border-cyan-500/30",
    delay: 0.3,
    color: "cyan-500"
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Bespoke UI Design",
    description: "Pixel-perfect interfaces tailored to your brand's unique identity. We create intuitive user experiences that drive engagement and conversion.",
    className: "md:col-span-2 bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
    delay: 0.4,
    color: "amber-500"
  }
];

function FeatureCard({ feature }: { feature: typeof bentoFeatures[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: feature.delay }}
      className={`group relative rounded-3xl border p-8 transition-all duration-700 hover:shadow-2xl overflow-hidden ${feature.className}`}
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
          className={`w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 text-${feature.color} shadow-lg shadow-black/5`}
        >
          {feature.icon}
        </motion.div>
        
        <h4 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h4>
        <p className="text-muted-foreground leading-relaxed font-light group-hover:text-foreground transition-colors duration-500">
          {feature.description}
        </p>
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
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bentoFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision: Sticky Side Scroll */}
      <section className="py-32 px-6 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group p-12 rounded-[3rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  "At our core, it's about people. Through fearless collaboration and operational brilliance, we deliver solutions that define tomorrow's standard."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group p-12 rounded-[3rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  To inspire excellence globally by delivering unmatched experiences and championing innovation in every project we touch.
                </p>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              <div className="sticky top-40 aspect-square rounded-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-500/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-2/3 h-2/3">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[1px] border-primary/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border-[1px] border-indigo-500/20 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code2 className="w-16 h-16 text-primary opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
