import TeamMemberCard from "../TeamMemberCard";
import teamMember1 from "@assets/generated_images/Team_member_portrait_1_7d29333a.png";

export default function TeamMemberCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <TeamMemberCard
        name="Sarah Johnson"
        role="Lead Developer"
        skills={["React", "Node.js", "TypeScript"]}
        status="available"
        bio="Passionate about building scalable web applications with modern technologies. 5+ years of experience in full-stack development."
        image={teamMember1}
      />
    </div>
  );
}
