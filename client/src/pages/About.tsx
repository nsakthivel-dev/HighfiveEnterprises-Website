import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  Zap, 
  Users, 
  MessageCircle,
  Rocket,
  Target,
  RefreshCw,
  Heart,
  Ear,
  Lightbulb,
  LineChart,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
  Code,
  Layers,
  Shield,
  Compass
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const values = [
    {
      icon: Target,
      title: "Build What Matters",
      description: "We prioritize clarity, simplicity, and meaningful outcomes that drive real business value.",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      delay: 0.1
    },
    {
      icon: MessageCircle,
      title: "Be Transparent",
      description: "Honest, clear communication at every step. No surprises, just partnership.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Move Fast, Improve Faster",
      description: "Rapid iteration and continuous improvement without sacrificing quality.",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      delay: 0.3
    },
    {
      icon: Heart,
      title: "Partner Mindset",
      description: "We think like teammates, not contractors. Your success is our success.",
      gradient: "from-pink-500 via-rose-500 to-purple-500",
      delay: 0.4
    },
  ];

  const differentiators = [
    {
      icon: Users,
      title: "Founder-Friendly Collaboration",
      description: "Direct access to the people actually building your product. No middlemen, no barriers.",
      color: "text-blue-500"
    },
    {
      icon: Rocket,
      title: "Flexible & Fast",
      description: "We adapt quickly as your idea evolves—because we know it will, and that's okay.",
      color: "text-purple-500"
    },
    {
      icon: CheckCircle2,
      title: "Outcome-Focused",
      description: "We care about what works in the real world, not just what looks good on paper.",
      color: "text-emerald-500"
    },
    {
      icon: LineChart,
      title: "Balanced Product + Tech",
      description: "Perfect blend of usability, scalability, and real-world value in every solution.",
      color: "text-orange-500"
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
    { 
      icon: MessageCircle, 
      title: "Stay Close Throughout", 
      description: "Weekly updates, collaborative problem-solving, and transparent communication.",
      number: "05"
    },
  ];

  const stats = [
    { 
      icon: TrendingUp,
      value: "3+", 
      label: "Active Projects",
      description: "Building tomorrow's solutions today"
    },
    { 
      icon: Globe,
      value: "Multiple", 
      label: "Industries",
      description: "From fintech to healthcare"
    },
    { 
      icon: Award,
      value: "100%", 
      label: "Client Satisfaction",
      description: "Partnerships that last"
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Dramatic Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
              transition: 'background 0.3s ease'
            }}
          />
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 glass-morphic px-6 py-3 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold tracking-wide">WHO WE ARE</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Built for Builders
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              We're a small, agile team of designers, developers, and product thinkers who understand exactly what it takes to build something new.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12 group">
                <Link href="/contact" className="flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-20"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="glass-morphic p-6 rounded-2xl text-center group hover:scale-105 transition-transform"
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2 gradient-text">{stat.value}</div>
                  <div className="text-sm font-semibold mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Our Story - Asymmetric Layout */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8 w-full">
                    {[Code, Layers, Shield, Compass].map((Icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="aspect-square glass-morphic rounded-2xl flex items-center justify-center group hover:scale-110 transition-transform"
                      >
                        <Icon className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">OUR JOURNEY</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Built for People Who Want to Grow
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We started with a simple belief: when teams grow, everything grows with them. Too many environments hold people back instead of lifting them up.
                </p>
                <p className="text-xl font-semibold text-foreground">
                  So we set out to create something different—an environment where growth isn’t a perk, it’s the foundation.
                </p>
                <p>
                  What began as a small idea has become a place where team members and the people around them can learn, thrive, and build a better future together.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button size="lg" className="group">
                  <Link href="/team" className="flex items-center gap-2">
                    Meet the Team
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values - Bold Grid */}
      <section className="py-32 px-6 bg-gradient-to-b from-muted/40 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">CORE VALUES</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How We Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our principles guide every decision, every line of code, every conversation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: value.delay }}
                  className="group relative"
                >
                  <Card className="relative p-8 h-full border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">WHY US</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why Startups Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're not just another agency. We're your technical co-founders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach - Timeline Style */}
      <section className="py-32 px-6 bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">OUR PROCESS</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How We Build Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A proven methodology refined through countless successful launches.
            </p>
          </motion.div>

          <div className="space-y-6">
            {approach.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                            {step.number}
                          </span>
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Bold & Centered */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 2px, transparent 0)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Let's Build Something
            <span className="block gradient-text">That Matters</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to launch, validate, or improve your product? We'd love to collaborate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-10 h-14 group">
              <Link href="/contact" className="flex items-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 h-14">
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>

          <div className="mt-16 pt-16 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-6">Trusted by innovative startups worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-12 rounded-lg bg-muted/50" />
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}