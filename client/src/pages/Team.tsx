import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TeamMemberCard from "@/components/TeamMemberCard";

type ApiMember = {
  id: string;
  name: string;
  role: string;
  avatar_url?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  experience_level?: "Beginner" | "Intermediate" | "Expert" | null;
  specialization?: string | null;
  email?: string | null;
  linkedin?: string | null;
  status?: "Active" | "Alumni" | "Mentor" | null;
  years_experience?: number | null;
  location?: string | null;
  department?: string | null;
  socials?: Record<string, string> | null;
};

export default function Team() {
  const { data: apiMembers = [], isLoading, isError } = useQuery<ApiMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const r = await fetch("/api/team");
      if (!r.ok) throw new Error("Failed to load team");
      return r.json();
    },
  });
  const defaultAvatar = '/placeholder.svg';

  const mapped = useMemo(() => apiMembers.map((m, i) => ({
    name: m.name,
    role: m.role,
    // Use all skills from API; do not truncate
    skills: (Array.isArray(m.skills) ? m.skills : []) as string[],
    status: "available" as const,
    bio: m.bio ?? "",
    image: m.avatar_url || defaultAvatar,
    featured: i === 0,
    years_experience: m.years_experience ?? undefined,
    location: m.location ?? undefined,
    department: m.department ?? undefined,
    experience_level: m.experience_level ?? undefined,
    specialization: m.specialization ?? undefined,
    email: m.email ?? undefined,
    linkedin: m.linkedin ?? undefined,
    member_status: m.status ?? "Active",
  })), [apiMembers]);

  const featuredMember = mapped[0];
  const otherMembers = mapped.slice(1);

  // Filters & search
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  const allRoles = useMemo(() => {
    const s = new Set<string>();
    mapped.forEach(m => m.role && s.add(m.role));
    return ["all", ...Array.from(s).sort()];
  }, [mapped]);
  const allSkills = useMemo(() => {
    const s = new Set<string>();
    mapped.forEach(m => m.skills?.forEach(k => s.add(k)));
    return ["all", ...Array.from(s).sort()];
  }, [mapped]);

  const filteredMembers = useMemo(() => mapped.filter(m => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [m.name, m.role, m.bio].join(" ").toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesSkill = skillFilter === "all" || (m.skills || []).includes(skillFilter);
    return matchesSearch && matchesRole && matchesSkill;
  }), [mapped, search, roleFilter, skillFilter]);

  // Spotlight rotator (all members)
  const spotlight = mapped;
  const [spotIndex, setSpotIndex] = useState(0);
  useEffect(() => {
    if (spotlight.length < 2) return;
    const id = setInterval(() => setSpotIndex(i => (i + 1) % spotlight.length), 4000);
    return () => clearInterval(id);
  }, [spotlight.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with stats */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals behind our success
          </p>
        </div>
      </section>

      {isLoading && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto text-center text-muted-foreground">Loading team…</div>
        </section>
      )}

      {isError && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto text-center text-destructive">Failed to load team</div>
        </section>
      )}

      {/* Spotlight Section */}
      {featuredMember && spotlight.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-3xl font-bold">Spotlight</h2>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-2 rounded-lg blur opacity-25"></div>
                <div className="relative">
                  <TeamMemberCard {...spotlight[spotIndex]} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Grid with search/filters */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            <div>
              <label htmlFor="search">Search</label>
              <input id="search" placeholder="Search name, role, bio" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <select id="role" className="w-full h-10 rounded-md border bg-background px-3" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="skill">Skill</label>
              <select id="skill" className="w-full h-10 rounded-md border bg-background px-3" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Culture Panel */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Life at HighFive Enterprises</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Our Values</h3>
              <p className="text-sm text-muted-foreground">
                At HighFive, we believe in craft, curiosity, and kindness. We move fast, build with purpose, and constantly learn from each other. Every project is a chance to grow and every challenge an opportunity to support our teammates.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Team Moments</h3>
              <p className="text-sm text-muted-foreground">
                From hackathons and offsites to everyday wins, our team thrives on collaboration and celebration. We take pride in our achievements and learn from every setback, together as one team.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Growth Mindset</h3>
              <p className="text-sm text-muted-foreground">
                We are committed to continuous growth. Through certifications, mentorship programs, and dedicated deep-work time, we invest in sharpening our skills and pushing our craft forward every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-3" variant="secondary">We’re Hiring</Badge>
          <h2 className="text-3xl font-bold mb-3">Join Our Team</h2>
          <p className="text-muted-foreground mb-6">We’re growing across engineering, design, and product. Come build with us.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <a href="/join-team" aria-label="Get in team">Get In Team</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact" aria-label="Get in touch">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
