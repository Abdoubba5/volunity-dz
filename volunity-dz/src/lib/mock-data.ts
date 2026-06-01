import type { Event } from '@/types';

interface EventFull extends Event {
  time: string;
  capacity: number;
  featured: boolean;
  points_reward: number;
  requirements: string[];
  tags: string[];
  schedule: { time: string; title: string; description: string }[];
  gallery: string[];
  participants: { id: string; name: string; avatar?: string }[];
  organizer: {
    id: string;
    name: string;
    logo?: string;
    followers: number;
  };
}

export const MOCK_EVENTS_FULL: EventFull[] = [
  {
    id: '1',
    title: 'Beach Cleanup Campaign',
    description:
      'Join us in cleaning the beautiful coastal areas of Algiers and raising awareness about marine pollution. Together, we can protect our oceans and beaches for future generations. This event is part of our ongoing effort to make Algeria cleaner and greener.',
    category: 'environment',
    location: 'Sablette Beach, Algiers',
    date: '2026-06-15',
    time: '08:00 - 12:00',
    image: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=1200&q=80',
    created_by: '1',
    participants_count: 124,
    capacity: 200,
    featured: true,
    points_reward: 150,
    created_at: '2026-05-01',
    requirements: [
      'Bring reusable gloves and a hat',
      'Wear comfortable clothes you can get dirty',
      'Bring your own water bottle',
      'Minimum age: 16 years old',
    ],
    tags: ['cleanup', 'beach', 'ocean', 'community', 'sustainability'],
    schedule: [
      {
        time: '08:00 - 08:30',
        title: 'Welcome & registration',
        description: 'Meet the team, sign in and grab your cleanup kit.',
      },
      {
        time: '08:30 - 10:30',
        title: 'Beach cleanup activity',
        description: 'Work in teams to collect waste along the beach.',
      },
      {
        time: '10:30 - 11:00',
        title: 'Break & refreshments',
        description: 'Enjoy snacks and refreshments while networking.',
      },
      {
        time: '11:00 - 12:00',
        title: 'Sorting & awareness session',
        description: 'Sort collected waste and learn about recycling.',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=400&q=80',
      'https://images.unsplash.com/photo-1618477462146-050d2767eac4?w=400&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&q=80',
      'https://images.unsplash.com/photo-1610561072246-7eda47c14ac1?w=400&q=80',
    ],
    participants: [
      { id: 'p1', name: 'Sarah Khaled' },
      { id: 'p2', name: 'Amine Benali' },
      { id: 'p3', name: 'Lina Hadj' },
      { id: 'p4', name: 'Karim Mansour' },
      { id: 'p5', name: 'Yasmine Boudiaf' },
      { id: 'p6', name: 'Mehdi Cherif' },
      { id: 'p7', name: 'Nour El Houda' },
      { id: 'p8', name: 'Reda Belkacem' },
    ],
    organizer: {
      id: 'a1',
      name: 'Green Algeria',
      followers: 12400,
    },
  },
  {
    id: '2',
    title: 'Education for All',
    description:
      'Help us teach underprivileged children in rural areas. Your time can shape their future. We provide training, materials, and ongoing support to all volunteers.',
    category: 'education',
    location: 'Tizi Ouzou',
    date: '2026-06-20',
    time: '09:00 - 15:00',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    created_by: '2',
    participants_count: 89,
    capacity: 100,
    featured: true,
    points_reward: 200,
    created_at: '2026-05-05',
    requirements: [
      'Patience and empathy',
      'Basic French or Arabic',
      'Teaching experience is a plus',
      'Commit at least 4 hours',
    ],
    tags: ['education', 'teaching', 'children', 'rural'],
    schedule: [
      {
        time: '09:00 - 09:30',
        title: 'Arrival and orientation',
        description: 'Tour of the facility and meet the team.',
      },
      {
        time: '09:30 - 12:00',
        title: 'Teaching sessions',
        description: 'Conduct educational activities with the children.',
      },
      {
        time: '12:00 - 13:00',
        title: 'Lunch break',
        description: 'Lunch provided on-site with the team.',
      },
      {
        time: '13:00 - 15:00',
        title: 'Activities and games',
        description: 'Engage kids in fun educational games.',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80',
    ],
    participants: [
      { id: 'p1', name: 'Sarah Khaled' },
      { id: 'p2', name: 'Amine Benali' },
    ],
    organizer: {
      id: 'a2',
      name: 'Youth for Education',
      followers: 8900,
    },
  },
];

export const MOCK_VOLUNTEERS_DETAILED = [
  {
    id: 'v1',
    name: 'Sarah Khaled',
    username: '@sarahk',
    bio: 'Passionate about environmental causes and community building. Computer science student at USTHB. Always looking for new ways to make a difference.',
    avatar: '',
    cover: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80',
    location: 'Algiers',
    university: 'USTHB',
    points: 2450,
    level: 12,
    hours: 124,
    events_joined: 32,
    badges_count: 18,
    followers: 423,
    following: 156,
    joined_at: '2024-03-15',
    role: 'user' as const,
    online: true,
    verified: true,
  },
  {
    id: 'v2',
    name: 'Amine Benali',
    username: '@amineb',
    bio: 'Software engineer by day, volunteer by night. Love teaching kids to code.',
    avatar: '',
    location: 'Oran',
    points: 2180,
    level: 11,
    hours: 108,
    events_joined: 28,
    badges_count: 15,
    followers: 312,
    following: 98,
    joined_at: '2024-05-20',
    role: 'user' as const,
    online: false,
    verified: false,
  },
];

export const MOCK_ASSOCIATIONS_DETAILED = [
  {
    id: 'a1',
    name: 'Green Algeria',
    username: '@greenalgeria',
    bio: 'Leading environmental organization in Algeria. We organize cleanups, tree planting, and awareness campaigns across the country. Together for a greener future.',
    logo: '',
    cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80',
    location: 'Algiers, Algeria',
    founded: '2018',
    followers: 12400,
    following: 234,
    events_count: 45,
    members_count: 320,
    verified: true,
    website: 'https://greenalgeria.org',
    category: 'environment',
    impact: {
      trees_planted: 12500,
      cleanups: 89,
      volunteers: 4500,
      cities: 32,
    },
  },
];

export const MOCK_NOTIFICATIONS_DETAILED = [
  {
    id: 'n1',
    type: 'event' as const,
    title: 'Event starting soon!',
    description: 'Beach Cleanup Campaign starts in 2 hours at Sablette Beach',
    time: '2h ago',
    unread: true,
    icon: 'calendar' as const,
    action: '/events/1',
  },
  {
    id: 'n2',
    type: 'badge' as const,
    title: 'New badge unlocked!',
    description: 'You earned the "Eco Warrior" badge for participating in 5 environmental events',
    time: '5h ago',
    unread: true,
    icon: 'trophy' as const,
    action: '/profile',
  },
  {
    id: 'n3',
    type: 'social' as const,
    title: 'New follower',
    description: 'Green Algeria started following you',
    time: '1d ago',
    unread: true,
    icon: 'users' as const,
    action: '/associations/a1',
  },
  {
    id: 'n4',
    type: 'event' as const,
    title: 'Event confirmed',
    description: 'You are confirmed for "Education for All" on June 20',
    time: '2d ago',
    unread: false,
    icon: 'calendar' as const,
    action: '/events/2',
  },
  {
    id: 'n5',
    type: 'social' as const,
    title: 'New comment',
    description: 'Karim commented on your event review',
    time: '3d ago',
    unread: false,
    icon: 'users' as const,
    action: '/events/1',
  },
  {
    id: 'n6',
    type: 'system' as const,
    title: 'Level up!',
    description: 'You reached Level 12 - keep up the great work!',
    time: '5d ago',
    unread: false,
    icon: 'sparkles' as const,
    action: '/profile',
  },
  {
    id: 'n7',
    type: 'badge' as const,
    title: 'Badge progress',
    description: 'You are 2 events away from the "Community Hero" badge',
    time: '1w ago',
    unread: false,
    icon: 'trophy' as const,
    action: '/profile',
  },
];

export const MOCK_BADGES = [
  { id: 'b1', name: 'Eco Warrior', description: 'Participated in 5 environmental events', icon: '🌱', tier: 'gold', progress: 100 },
  { id: 'b2', name: 'Community Hero', description: 'Joined 20 community events', icon: '🦸', tier: 'silver', progress: 80 },
  { id: 'b3', name: 'Early Bird', description: 'Joined 10 morning events', icon: '🌅', tier: 'gold', progress: 100 },
  { id: 'b4', name: 'Mentor', description: 'Helped 5 new volunteers', icon: '👨‍🏫', tier: 'bronze', progress: 60 },
  { id: 'b5', name: 'Trailblazer', description: 'First to join 3 events', icon: '🚀', tier: 'silver', progress: 100 },
  { id: 'b6', name: 'Streak Master', description: '30 day volunteering streak', icon: '🔥', tier: 'gold', progress: 45 },
  { id: 'b7', name: 'Globetrotter', description: 'Volunteered in 5 different cities', icon: '🌍', tier: 'bronze', progress: 30 },
  { id: 'b8', name: 'Social Butterfly', description: 'Connected with 50 volunteers', icon: '🦋', tier: 'silver', progress: 75 },
];
