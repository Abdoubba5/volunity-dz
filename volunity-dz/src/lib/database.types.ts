export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<Profile>;
        Relationships: [];
      };
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: Partial<Event>;
        Relationships: [];
      };
      event_participants: {
        Row: EventParticipant;
        Insert: Omit<EventParticipant, 'id' | 'joined_at'> & { id?: string; joined_at?: string };
        Update: Partial<EventParticipant>;
        Relationships: [];
      };
      associations: {
        Row: Association;
        Insert: AssociationInsert;
        Update: Partial<Association>;
        Relationships: [];
      };
      association_members: {
        Row: AssociationMember;
        Insert: Omit<AssociationMember, 'id' | 'joined_at'> & { id?: string; joined_at?: string };
        Update: Partial<AssociationMember>;
        Relationships: [];
      };
      badges: {
        Row: BadgeRow;
        Insert: Omit<BadgeRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<BadgeRow>;
        Relationships: [];
      };
      user_badges: {
        Row: UserBadge;
        Insert: Omit<UserBadge, 'id' | 'earned_at'> & { id?: string; earned_at?: string };
        Update: Partial<UserBadge>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Omit<NotificationRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<NotificationRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type UserRole = 'user' | 'association' | 'admin';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'education' | 'environment' | 'health' | 'culture' | 'sports' | 'social';
export type ParticipationStatus = 'confirmed' | 'attended' | 'cancelled';
export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type MemberRole = 'admin' | 'moderator' | 'member';
export type NotificationType = 'event' | 'badge' | 'social' | 'system';

export type Profile = {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  university: string | null;
  city: string | null;
  points: number;
  level: number;
  role: UserRole;
  followers_count: number;
  following_count: number;
  hours_volunteered: number;
  events_joined: number;
  badges_count: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  location: string;
  date: string;
  time: string | null;
  image_url: string | null;
  capacity: number;
  participants_count: number;
  points_reward: number;
  organizer_id: string;
  status: EventStatus;
  featured: boolean;
  tags: string[];
  requirements: string[];
  schedule: Json;
  gallery: string[];
  created_at: string;
  updated_at: string;
};

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'participants_count'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  participants_count?: number;
};

export type EventParticipant = {
  id: string;
  event_id: string;
  user_id: string;
  status: ParticipationStatus;
  joined_at: string;
};

export type Association = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  website: string | null;
  verified: boolean;
  owner_id: string;
  location: string | null;
  founded: string | null;
  category: EventCategory | null;
  followers_count: number;
  events_count: number;
  members_count: number;
  impact: Json;
  created_at: string;
  updated_at: string;
};

export type AssociationInsert = Omit<Association, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AssociationMember = {
  id: string;
  association_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
};

export type BadgeRow = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  tier: BadgeTier;
  required_points: number;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  description: string | null;
  icon: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
