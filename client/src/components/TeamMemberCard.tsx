import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export type AvailabilityStatus = "available" | "busy" | "on-project";

interface TeamMemberCardProps {
  name: string;
  role: string;
  skills: string[];
  status: AvailabilityStatus;
  bio: string;
  image: string;
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
}: TeamMemberCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="hover-elevate transition-all duration-300 cursor-pointer overflow-visible"
      onClick={() => setExpanded(!expanded)}
      data-testid={`card-team-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={image} alt={name} />
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
          <p className="text-muted-foreground mb-3">{role}</p>

          <Badge variant="secondary" className="mb-4">
            {statusConfig[status].label}
          </Badge>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {expanded && (
            <p className="text-sm text-muted-foreground mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {bio}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
