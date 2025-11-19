import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TeamMember } from '../types/TeamMember';
import { FaLinkedin, FaEnvelope, FaTimes } from 'react-icons/fa';

interface TeamMemberModalProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, isOpen, onClose }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-body">
          <div className="member-details">
            <p className="bio">{member.bio}</p>
            
            <div className="skills-container">
              {member.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div className="additional-info">
              <p className="experience">
                <strong>Experience Level:</strong> {member.experienceLevel}
              </p>
              <p className="specialization">
                <strong>Specialization:</strong> {member.specialization}
              </p>
            </div>

            <div className="contact-links">
              <a 
                href={`mailto:${member.email}`} 
                className="icon-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaEnvelope />
              </a>
              <a 
                href={member.linkedIn} 
                className="icon-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TeamMemberModal;
