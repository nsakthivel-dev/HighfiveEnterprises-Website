import React, { useState } from 'react';
import { TeamMember } from '../types/TeamMember';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import TeamMemberModal from './TeamMemberModal';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="team-member-card" onClick={() => setIsModalOpen(true)}>
        <div className="member-photo">
          {member.photo ? (
            <img src={member.photo} alt={member.name} />
          ) : (
            <div className="avatar-placeholder">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <span className={`status-indicator ${member.status.toLowerCase()}`} />
        </div>
        <div className="member-info">
          <h3>{member.name}</h3>
          <p className="role">{member.role}</p>
          <p className={`availability ${member.status.toLowerCase()}`}>
            {member.status === 'Active' ? 'Available' : 
             member.status === 'Alumni' ? 'Alumni' : 'Mentor'}
          </p>
        </div>
      </div>

      <TeamMemberModal
        member={member}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default TeamMemberCard;
