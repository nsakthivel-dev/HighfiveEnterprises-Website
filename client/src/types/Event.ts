export interface Event {
  id?: string;
  title: string;
  description?: string | null;
  event_date: string;
  location?: string | null;
  image_url?: string | null;
  category?: string | null;
  status: 'upcoming' | 'ongoing' | 'completed';
  featured?: boolean;
  organizers?: string[]; // Array of organizer names, including [PARTICIPANT] prefixed names
  tags?: string[];
  registration_url?: string | null;
  experience?: string | null; // New field for event experience
  created_at?: string;
  updated_at?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  featured: boolean;
  organizers: string; // Comma-separated string of organizers
  tags: string; // Comma-separated string of tags
  experience: string; // New field for event experience
}