// 1. Matches your Mongoose schema ENUM exactly
export type UserRole = 'user' | 'community_admin' | 'super_admin';

// 2. The Avatar structure from your DB
export type AvatarType = {
  url?: string;
  publicId?: string;
};

// 3. The User Object returned from the Login API
export type AuthUser = {
  _id: string; // MongoDB uses _id, not id
  name: string;
  email: string;
  role: UserRole;
  avatar?: AvatarType;
  
  // SaaS Fields
  community?: any | null; // Can type this strictly later when Community types are made
  plan?: 'Free' | 'Premium';
  credits?: number;
  
  // Gamification
  trustScore?: number;
  activityScore?: number;
  badges?: string[];

  // Security
  isVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

// 4. The Response Structure from the Login API
export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

// 5. The Redux State Slice
export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};