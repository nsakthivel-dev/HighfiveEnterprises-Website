import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { TeamMember } from '../types/TeamMember';

interface TeamMembersGridProps {
  members: TeamMember[];
}

const TeamMembersGrid: React.FC<TeamMembersGridProps> = ({ members }) => {
  return (
    <div className="team-members-grid">
      {members.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default TeamMembersGrid;

// Add this CSS to your styles file:
const styles = `
.team-members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
`;
