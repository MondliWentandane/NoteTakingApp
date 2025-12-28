// services/notesService.ts
import { storage } from '../utils/storage';
import { Note, Category } from '../types';

export const notesService = {
  async getAllNotes(userId: string): Promise<Note[]> {
    try {
      const notes = await storage.getNotes();
      return notes.filter((note: Note) => note.userId === userId);
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async getNotesByCategory(userId: string, category: Category): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes(userId);
      return notes.filter((note: Note) => note.category === category);
    } catch (error) {
      console.error('Error getting notes by category:', error);
      return [];
    }
  },

  async addNote(note: Omit<Note, 'id' | 'dateAdded'>): Promise<Note> {
    try {
      const notes = await storage.getNotes();
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      notes.push(newNote);
      await storage.saveNotes(notes);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  async updateNote(noteId: string, updates: Partial<Note>): Promise<boolean> {
    try {
      const notes = await storage.getNotes();
      const noteIndex = notes.findIndex((n: Note) => n.id === noteId);
      
      if (noteIndex === -1) {
        return false;
      }

      notes[noteIndex] = {
        ...notes[noteIndex],
        ...updates,
        dateUpdated: new Date().toISOString(),
      };
      
      await storage.saveNotes(notes);
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  },

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const notes = await storage.getNotes();
      const filteredNotes = notes.filter((n: Note) => n.id !== noteId);
      await storage.saveNotes(filteredNotes);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  },

  async searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes(userId);
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return notes.filter((note: Note) => {
        const titleMatch = note.title?.toLowerCase().includes(lowerSearchTerm);
        const notesMatch = note.notes.toLowerCase().includes(lowerSearchTerm);
        return titleMatch || notesMatch;
      });
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  },

  sortNotes(notes: Note[], ascending: boolean = true): Note[] {
    return [...notes].sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  },
};