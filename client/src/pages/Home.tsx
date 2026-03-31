import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Lightbulb, 
  Target, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe,
  Layout,
  MousePointer2,
  Code2
} from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const bentoFeatures = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "High Performance",
    description: "Optimized for speed and efficiency, ensuring your users never have to wait.",
    className: "md:col-span-2 md:row-span-1 bg-primary/10 border-primary/20",
    delay: 0.1
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "Built-in protection for your data and users.",
    className: "md:col-span-1 md:row-span-2 bg-indigo-500/10 border-indigo-500/20",
    delay: 0.2
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Scalable Core",
    description: "Architecture that grows with you.",
    className: "md:col-span-1 md:row-span-1 bg-cyan-500/10 border-cyan-500/20",
    delay: 0.3
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "Bespoke UI",
    description: "Crafted specifically for your brand.",
    className: "md:col-span-2 md:row-span-1 bg-amber-500/10 border-amber-500/20",
    delay: 0.4
  }
];

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

      {/* Bento Feature Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Core Capabilities</h3>
            <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">Built for the modern web.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
            {bentoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                className={`group relative rounded-[2.5rem] border p-10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${feature.className}`}
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                  {feature.icon}
                </div>
              </motion.div>
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
