export type UserRole = 'user' | 'community_admin' | 'super_admin';
export type SubscriptionPlan = 'Free' | 'Premium';
export type SocialProvider = 'google' | 'email';

export interface Avatar {
  url?: string;
  publicId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: Avatar;
  role: UserRole;
  socialProvider: SocialProvider;

  // --- SaaS & Access ---
  // If populated, it's an object. If not, it's a string (ObjectId). 
  // We'll use 'any' for community just until you create the community.types.ts!
  community?: any | null; 
  plan: SubscriptionPlan;
  credits: number;

  // --- Gamification ---
  trustScore: number;
  activityScore: number;
  badges: string[];

  // --- Security ---
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}