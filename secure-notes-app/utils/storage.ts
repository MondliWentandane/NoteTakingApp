// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const NOTES_KEY = '@notes';
const CURRENT_USER_KEY = '@current_user';

export const storage = {
  // User operations
  async getUsers() {
    try {
      const users = await AsyncStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async saveUsers(users: any[]) {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async setCurrentUser(user: any) {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  async clearCurrentUser() {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error clearing current user:', error);
    }
  },

  // Notes operations
  async getNotes() {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async saveNotes(notes: any[]) {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },
};