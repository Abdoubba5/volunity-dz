export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  university?: string;
  city?: string;
  points: number;
  level: number;
  badge?: string;
  role: 'user' | 'association' | 'admin';
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  date: string;
  image?: string;
  created_by: string;
  participants_count: number;
  created_at: string;
};

export type Association = {
  id: string;
  name: string;
  description: string;
  logo?: string;
  verified: boolean;
  followers: number;
  owner_id: string;
  created_at: string;
};

export type Participation = {
  id: string;
  user_id: string;
  event_id: string;
  joined_at: string;
};

export type Badge = {
  id: string;
  title: string;
  description: string;
  required_points: number;
};

export type EventCategory = 'education' | 'environment' | 'health' | 'culture' | 'sports' | 'social';
