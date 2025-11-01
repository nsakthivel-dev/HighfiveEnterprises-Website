import TeamMemberCard from "@/components/TeamMemberCard";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import teamMember1 from "@assets/generated_images/Team_member_portrait_1_7d29333a.png";
import teamMember2 from "@assets/generated_images/Team_member_portrait_2_8107c9e7.png";
import teamMember3 from "@assets/generated_images/Team_member_portrait_3_ca1ed7e2.png";
import teamMember4 from "@assets/generated_images/Team_member_portrait_4_adb08dec.png";

export default function Team() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      status: "available" as const,
      bio: "Passionate about building scalable web applications with modern technologies. 5+ years of experience in full-stack development and team leadership.",
      image: teamMember1,
      featured: true,
    },
    {
      name: "Michael Chen",
      role: "Project Manager",
      skills: ["Agile", "Scrum", "Leadership", "Strategy"],
      status: "on-project" as const,
      bio: "Expert in delivering complex projects on time and within budget. Certified Scrum Master with 8+ years of experience.",
      image: teamMember2,
      featured: false,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      status: "available" as const,
      bio: "Creating beautiful and intuitive user experiences. Specialized in design systems and accessibility.",
      image: teamMember3,
      featured: false,
    },
    {
      name: "David Kumar",
      role: "Full-Stack Developer",
      skills: ["Python", "React", "PostgreSQL", "Docker"],
      status: "busy" as const,
      bio: "Versatile developer with expertise in both frontend and backend technologies. Focus on clean, maintainable code.",
      image: teamMember4,
      featured: false,
    },
  ];

  const featuredMember = teamMembers.find(m => m.featured);
  const otherMembers = teamMembers.filter(m => !m.featured);

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Talented individuals working together to create exceptional digital experiences
          </p>
        </div>
      </section>

      {featuredMember && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Team Member of the Month</h2>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-2 rounded-lg blur opacity-25"></div>
                <div className="relative">
                  <TeamMemberCard {...featuredMember} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're always looking for talented individuals to join our growing team
          </p>
          <Badge variant="secondary" className="text-base px-6 py-2">
            Careers Coming Soon
          </Badge>
        </div>
      </section>
    </div>
  );
}
