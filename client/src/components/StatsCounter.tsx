import { useEffect, useState, useRef } from "react";
import { Clock, Calendar, Rocket, Users, Target, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value, isInView]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const stats: StatItem[] = [
    { icon: Rocket, value: 50, label: "Projects Delivered", suffix: "+" },
    { icon: Users, value: 30, label: "Happy Clients", suffix: "+" },
    { icon: Target, value: 100, label: "Success Rate", suffix: "%" },
    { icon: Zap, value: 24, label: "Expert Support", suffix: "/7" },
  ];

  return (
    <div className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02] -skew-y-3 origin-right" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20">
                <stat.icon className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-3 font-heading tracking-tight text-foreground">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
