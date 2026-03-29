export type UserRole = "ADMIN" | "SUPER_ADMIN" | "MODERATOR";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};
