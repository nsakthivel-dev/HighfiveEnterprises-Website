import { motion } from "framer-motion";
import { Rocket, Target, Lightbulb, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

export default function Insights() {
  const futureGoals = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Innovation at Scale",
      description: "We are leveraging AI and emerging technologies to build solutions that scale with the growing needs of global enterprises.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      delay: 0.1
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Global Impact",
      description: "Expanding our footprint across continents, helping businesses transform their digital landscape with precision.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      delay: 0.2
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Thought Leadership",
      description: "Leading the conversation on technological trends and providing strategic guidance to the startup ecosystem.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      delay: 0.3
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sustainable Growth",
      description: "Building long-term partnerships and resilient software that evolves seamlessly with market demands.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Forward Thinking</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight font-heading">
              Insights & <span className="text-primary">Future Vision</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Exploring the intersection of human creativity and technological advancement to build a better tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Goals Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {futureGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: goal.delay }}
                className="group p-10 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl ${goal.bg} ${goal.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {goal.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{goal.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-light mb-6">
                  {goal.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 font-heading">Our Commitment</h2>
            <div className="relative">
              <span className="absolute -top-10 -left-10 text-9xl text-primary/10 font-serif">“</span>
              <p className="text-2xl md:text-3xl italic text-foreground font-light leading-relaxed relative z-10">
                We believe that the future of technology is not just about what we build, but how it empowers people and businesses to reach their full potential. Our journey is just beginning, and we are excited to have you with us.
              </p>
              <span className="absolute -bottom-20 -right-10 text-9xl text-primary/10 font-serif">”</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
