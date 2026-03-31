import { ArrowRight, Sparkles, ChevronDown, Rocket, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* High-End Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Animated Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-soft-light pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        
        {/* Dynamic Interactive Grid */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-[-10%] opacity-20"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </motion.div>

        {/* Floating Light Blobs */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                Elevate Your Digital Presence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-7xl md:text-9xl font-bold mb-8 tracking-tighter leading-[0.9] text-foreground"
            >
              Lupus <br />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">Venture</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light"
            >
              We engineer scalable, high-performance digital ecosystems for visionaries. Bridge the gap between complexity and intuitive experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link href="/what-we-do">
                <Button
                  size="lg"
                  className="h-16 px-10 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-500 group"
                >
                  Start Building
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/reach-us">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-xl font-bold rounded-2xl border-2 hover:bg-secondary/50 backdrop-blur-md transition-all duration-500"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Visual Elements */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="relative z-10"
            >
              {/* Creative Visual Asset: Interactive Card Stack */}
              <div className="relative w-full aspect-square">
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-white/10 backdrop-blur-2xl p-12 flex flex-col justify-between shadow-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                    <div className="h-4 w-full bg-white/10 rounded-full" />
                    <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4 pt-8">
                    <div className="w-12 h-12 rounded-full bg-primary" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-white/20 rounded-full" />
                      <div className="h-2 w-16 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Floating Elements */}
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [5, 2, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-10 -right-10 w-48 h-48 rounded-3xl bg-secondary/80 border border-border/50 backdrop-blur-xl p-6 shadow-xl flex flex-col items-center justify-center text-center"
                >
                  <Zap className="w-8 h-8 text-primary mb-3" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">High Speed</span>
                </motion.div>

                <motion.div 
                  animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-background/80 border border-border/50 backdrop-blur-xl p-4 shadow-xl flex flex-col items-center justify-center text-center"
                >
                  <Globe className="w-6 h-6 text-primary mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Reach</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground cursor-pointer flex flex-col items-center gap-2"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scroll</span>
        <ChevronDown className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
}
