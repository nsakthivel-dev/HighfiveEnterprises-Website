export interface Feedback {
  id?: string;
  name: string;
  email?: string | null;
  rating: number;
  message: string;
  is_approved?: boolean;
  project_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  message: string;
  project_id?: string | null;
}
