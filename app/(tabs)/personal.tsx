// app/(tabs)/personal.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { notesService } from '../../services/notesService';
import { Note } from '../../types';
import { NoteCard } from '../../components/NoteCard';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalNotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const loadNotes = async () => {
    if (user) {
      const personalNotes = await notesService.getNotesByCategory(user.id, 'personal');
      const sorted = notesService.sortNotes(personalNotes, sortAscending);
      setNotes(sorted);
      setFilteredNotes(sorted);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [user, sortAscending])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const results = notes.filter(
        (note) =>
          note.title?.toLowerCase().includes(query.toLowerCase()) ||
          note.notes.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(results);
    }
  };

  const handleDelete = async (noteId: string) => {
    const success = await notesService.deleteNote(noteId);
    if (success) {
      loadNotes();
      Alert.alert('Success', 'Note deleted successfully');
    }
  };

  const handleEdit = (note: Note) => {
    router.push({
      pathname: '/edit-note',
      params: { noteId: note.id },
    });
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
    const sorted = notesService.sortNotes(filteredNotes, !sortAscending);
    setFilteredNotes(sorted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search personal notes..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Ionicons
            name={sortAscending ? 'arrow-up' : 'arrow-down'}
            size={20}
            color="#007AFF"
          />
          <Text style={styles.sortText}>Date</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No personal notes</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/add-note', params: { category: 'personal' } })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});