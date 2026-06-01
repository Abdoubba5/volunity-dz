export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & { id: string; created_at?: string; updated_at?: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Event>;
        Relationships: [];
      };
      event_participants: {
        Row: EventParticipant;
        Insert: Omit<EventParticipant, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<EventParticipant>;
        Relationships: [];
      };
      associations: {
        Row: Association;
        Insert: Omit<Association, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Association>;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Post>;
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Comment>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string; created_at?: string; is_read?: boolean };
        Update: Partial<Notification>;
        Relationships: [];
      };
      student_stats: {
        Row: StudentStat;
        Insert: Omit<StudentStat, 'id'> & { id?: string };
        Update: Partial<StudentStat>;
        Relationships: [];
      };
      attendance: {
        Row: AttendanceRecord;
        Insert: Omit<AttendanceRecord, 'id' | 'scanned_at'> & { id?: string; scanned_at?: string };
        Update: Partial<AttendanceRecord>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Resource>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<AnalyticsEvent>;
        Relationships: [];
      };
      daily_metrics: {
        Row: DailyMetric;
        Insert: Omit<DailyMetric, 'id'> & { id?: string };
        Update: Partial<DailyMetric>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type UserRole = 'student' | 'moderator' | 'admin';

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string | null;
  university: string | null;
  faculty: string | null;
  department: string | null;
  academic_year: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string;
  image_url: string | null;
  created_by: string;
  category: string | null;
  max_participants: number;
  created_at: string;
  updated_at: string;
};

export type EventParticipant = {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'attended';
  created_at: string;
};

export type Association = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  president_name: string | null;
  faculty: string | null;
  email: string | null;
  created_by: string;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  related_id: string | null;
  type: 'general' | 'event' | 'post' | 'admin';
  is_read: boolean;
  created_at: string;
};

export type StudentStat = {
  id: string;
  user_id: string;
  events_attended: number;
  posts_count: number;
  join_date: string;
};

export type AttendanceRecord = {
  id: string;
  event_id: string;
  user_id: string;
  scanned_at: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  type: string | null;
  faculty: string | null;
  created_by: string;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  event_type: 'page_view' | 'action' | 'error' | 'performance' | 'navigation';
  user_id: string | null;
  event_name: string;
  event_data: Record<string, unknown>;
  session_id: string | null;
  page_url: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
};

export type DailyMetric = {
  id: string;
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
  total_events: number;
  events_created: number;
  total_participants: number;
  new_participants: number;
  total_posts: number;
  posts_created: number;
  total_associations: number;
  page_views: number;
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
