// services/authService.ts
import { storage } from '../utils/storage';
import { User } from '../types';

export const authService = {
  async register(email: string, username: string, password: string): Promise<User | null> {
    try {
      const users = await storage.getUsers();
      
      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        password, // In production, hash the password!
      };

      users.push(newUser);
      await storage.saveUsers(users);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    try {
      const users = await storage.getUsers();
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        await storage.setCurrentUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    await storage.clearCurrentUser();
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.getCurrentUser();
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const users = await storage.getUsers();
      const userIndex = users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        return false;
      }

      // Check if email is being changed and if it's already taken
      if (updates.email && updates.email !== users[userIndex].email) {
        const emailExists = users.some((u: User) => u.email === updates.email);
        if (emailExists) {
          throw new Error('Email already taken');
        }
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      await storage.saveUsers(users);
      
      // Update current user in storage
      const currentUser = await storage.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await storage.setCurrentUser(users[userIndex]);
      }
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  },
};