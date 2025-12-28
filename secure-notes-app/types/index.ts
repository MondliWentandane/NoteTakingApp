// types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  notes: string;
  category: 'work' | 'study' | 'personal';
  dateAdded: string;
  dateUpdated?: string;
}

export type Category = 'work' | 'study' | 'personal';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateCredentials: (email?: string, username?: string, password?: string) => Promise<boolean>;
  isLoading: boolean;
}