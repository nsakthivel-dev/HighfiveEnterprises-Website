import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Linkedin, MapPin, Calendar, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { TeamMemberCardProps } from './TeamMemberCard';

interface TeamMemberModalProps {
  member: TeamMemberCardProps;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      // Only reset overflow if no other modals are open
      const openModals = document.querySelectorAll('[data-modal-open]');
      if (openModals.length <= 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" data-modal-open>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleBackdropClick}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border bg-background shadow-lg animate-in zoom-in-95 slide-in-from-bottom-2" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="absolute -bottom-12 left-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <AvatarFallback className="text-3xl font-bold bg-primary/10">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Content */}
          <div className="pt-16 pb-6 px-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-lg text-muted-foreground">{member.role}</p>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${member.status === 'available' ? 'bg-status-online' : member.status === 'busy' ? 'bg-status-busy' : 'bg-status-away'}`} />
                <span className="text-sm text-muted-foreground">
                  {member.status === 'available' ? 'Available' : member.status === 'busy' ? 'Busy' : 'On Project'}
                </span>
                {member.member_status && (
                  <Badge variant="outline" className="ml-2">
                    {member.member_status}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Bio */}
            {member.bio && (
              <div className="space-y-2">
                <h3 className="font-semibold">About</h3>
                <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            )}
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.specialization && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Specialization</p>
                    <p className="font-medium">{member.specialization}</p>
                  </div>
                </div>
              )}
              
              {member.experience_level && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium">{member.experience_level} Level</p>
                  </div>
                </div>
              )}
              
              {member.years_experience && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Years</p>
                    <p className="font-medium">{member.years_experience} years</p>
                  </div>
                </div>
              )}
              
              {member.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{member.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Skills */}
            {member.skills && member.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact */}
            {(member.email || member.linkedin) && (
              <div className="flex gap-3 justify-center pt-4 border-t">
                {member.email && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${member.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {member.linkedin && (
                  <Button asChild variant="outline" size="sm">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}