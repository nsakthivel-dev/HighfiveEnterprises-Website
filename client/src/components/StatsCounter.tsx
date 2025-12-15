import { useEffect, useMemo, useState } from "react";
import { Users, Briefcase, Clock, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  customText?: string; // New property for custom text display
}

type ApiProject = { id: string; status?: string | null };
type ApiMember = { id: string };

export default function StatsCounter() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const { data: projects = [] } = useQuery<ApiProject[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const r = await fetch("/api/projects");
      if (!r.ok) throw new Error("Failed to load projects");
      return r.json();
    },
  });

  const { data: team = [] } = useQuery<ApiMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const r = await fetch("/api/team");
      if (!r.ok) throw new Error("Failed to load team");
      return r.json();
    },
  });

  const ongoingCount = useMemo(() => projects.filter(p => (p.status || "active") !== "completed").length, [projects]);
  const teamCount = team.length;

  const start = useMemo(() => new Date("2025-10-01T00:00:00Z"), []);
  const yearsOfInnovation = useMemo(() => {
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const hasAnniversaryPassed = (now.getMonth() > 9) || (now.getMonth() === 9 && now.getDate() >= 1); // month 9 = October
    if (!hasAnniversaryPassed) years -= 1;
    return Math.max(1, years + 1); // Show 1 in the first year, then +1 each anniversary
  }, [start]);

  const stats: StatItem[] = [
    { icon: <Briefcase className="w-8 h-8" />, value: ongoingCount, label: "Ongoing Projects" },
    { icon: <Users className="w-8 h-8" />, value: teamCount, label: "Team Members" },
    { icon: <Clock className="w-8 h-8" />, value: 0, label: "Working Hours", customText: "Mon–Fri, 9:00–18:00 IST" }, // Changed to custom text
    { icon: <Calendar className="w-8 h-8" />, value: yearsOfInnovation, label: yearsOfInnovation === 1 ? "Year of Innovation" : "Years of Innovation" },
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const counters = stats.map((stat, index) => {
      // Skip animation for the working hours since it's text-based now
      if (stat.customText) {
        return null;
      }
      
      let currentCount = 0;
      return setInterval(() => {
        currentCount += stat.value / steps;
        if (currentCount >= stat.value) {
          currentCount = stat.value;
          if (counters[index]) clearInterval(counters[index]);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(currentCount);
          return newCounts;
        });
      }, interval);
    });

    return () => counters.forEach(counter => counter && clearInterval(counter));
  }, [stats[0].value, stats[1].value, stats[3].value]); // Removed stats[2].value since it's not animated anymore

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
              <div className="text-2xl md:text-3xl font-bold mb-2 font-heading">
                {stat.customText ? (
                  <span className="text-sm md:text-base">{stat.customText}</span>
                ) : (
                  <>
                    {counts[index]}
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}