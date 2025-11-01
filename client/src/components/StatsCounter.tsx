import { useEffect, useState } from "react";
import { Users, Briefcase, Award, Calendar } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

export default function StatsCounter() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const stats: StatItem[] = [
    { icon: <Briefcase className="w-8 h-8" />, value: 150, label: "Projects Completed", suffix: "+" },
    { icon: <Users className="w-8 h-8" />, value: 8, label: "Team Members" },
    { icon: <Award className="w-8 h-8" />, value: 50, label: "Happy Clients", suffix: "+" },
    { icon: <Calendar className="w-8 h-8" />, value: 5, label: "Years Experience" },
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const counters = stats.map((stat, index) => {
      let currentCount = 0;
      return setInterval(() => {
        currentCount += stat.value / steps;
        if (currentCount >= stat.value) {
          currentCount = stat.value;
          clearInterval(counters[index]);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(currentCount);
          return newCounts;
        });
      }, interval);
    });

    return () => counters.forEach(clearInterval);
  }, []);

  return (
    <div className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-heading">
                {counts[index]}
                {stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
