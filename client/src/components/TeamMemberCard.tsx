import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Mail, Linkedin } from "lucide-react";
import TeamMemberModal from "./TeamMemberModal";

export type AvailabilityStatus = "available" | "busy" | "on-project";

export interface TeamMemberCardProps {
  name: string;
  role: string;
  skills: string[];
  status: 'available';
  bio: string;
  image: string;
  featured?: boolean;
  years_experience?: number;
  location?: string;
  department?: string;
  experience_level?: string;
  specialization?: string;
  email?: string;
  linkedin?: string;
  member_status?: string;
}

const statusConfig = {
  available: { label: "Available", color: "bg-status-online" },
  busy: { label: "Busy", color: "bg-status-busy" },
  "on-project": { label: "On Project", color: "bg-status-away" },
};

export default function TeamMemberCard({
  name,
  role,
  skills,
  status,
  bio,
  image,
  featured,
  years_experience,
  location,
  department,
  experience_level,
  specialization,
  email,
  linkedin,
  member_status,
}: TeamMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const memberId = `member-${name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  const memberData = {
    name,
    role,
    skills,
    status,
    bio,
    image,
    featured,
    years_experience,
    location,
    department,
    experience_level,
    specialization,
    email,
    linkedin,
    member_status,
  };

  return (
    <>
      <Card
        className="hover-elevate transition-all duration-300 cursor-pointer overflow-visible"
        onClick={handleCardClick}
        data-testid={`card-team-${name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage 
                  src={image} 
                  alt={name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <AvatarFallback className="text-2xl font-bold">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 w-6 h-6 ${statusConfig[status].color} rounded-full border-4 border-card`}
              />
            </div>

            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-muted-foreground mb-2">{role}</p>
            
            <Badge variant="secondary" className="mb-4">
              {statusConfig[status].label}
            </Badge>
            
            {member_status && (
              <Badge variant="outline" className="mb-3 ml-2">
                {member_status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <TeamMemberModal
        member={memberData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
