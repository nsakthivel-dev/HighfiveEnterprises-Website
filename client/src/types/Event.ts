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
  organizers?: string[]; // Changed from organizer to organizers array
  tags?: string[];
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
}