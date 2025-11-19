export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  skills: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  specialization: string;
  email: string;
  linkedIn: string;
  status: 'Active' | 'Alumni' | 'Mentor';
}
