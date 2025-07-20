export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface ProfileLink {
  id: string;
  userId: string;
  platform: string;
  url: string;
  title: string;
  description?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClickLog {
  id: string;
  linkId: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  loginWithError?: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupWithError?: (username: string, email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export interface Platform {
  name: string;
  icon: string;
  color: string;
  baseUrl: string;
}