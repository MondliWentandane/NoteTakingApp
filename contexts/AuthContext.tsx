// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await authService.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const newUser = await authService.register(email, username, password);
      if (newUser) {
        setUser(newUser);
        await authService.login(email, password);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateCredentials = async (
    email?: string,
    username?: string,
    password?: string
  ): Promise<boolean> => {
    if (!user) return false;

    const updates: Partial<User> = {};
    if (email) updates.email = email;
    if (username) updates.username = username;
    if (password) updates.password = password;

    const success = await authService.updateUser(user.id, updates);
    if (success) {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateCredentials,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};