import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsContext, Project, Category, Difficulty } from '../../contexts/ProjectsContext';
import type { RootStackParamList, StudentTabNavigationProp } from '../../types/navigation';
import { ProjectCard } from '../../components/ProjectCard';
import { ScrollView } from 'react-native-gesture-handler';

type ProjectsListNavigationProp = StudentTabNavigationProp;

export default function ProjectsListScreen() {
  const navigation = useNavigation<ProjectsListNavigationProp>();
  const { projects, loading } = useContext(ProjectsContext);
  
  // Solo mostrar proyectos disponibles
  const availableProjects = projects.filter(p => p.isAvailable);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const categories = [
    { value: 'mechanics', label: 'Mecánica' },
    { value: 'electronics', label: 'Electrónica' },
    { value: 'programming', label: 'Programación' },
    { value: 'design', label: 'Diseño' },
    { value: 'science', label: 'Ciencia' },
  ];
  
  const difficulties = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
  ];
  
  // Filtrar proyectos
  const filteredProjects = availableProjects.filter(project => {
    // Filtrar por búsqueda
    const matchesSearch = searchQuery.trim() === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por categoría
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    
    // Filtrar por dificultad
    const matchesDifficulty = !selectedDifficulty || project.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyectos Disponibles</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proyectos"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Categorías:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedCategory && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedCategory && styles.activeFilterChipText,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.filterChip,
                selectedCategory === category.value && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedCategory(
                selectedCategory === category.value ? null : category.value
              )}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category.value && styles.activeFilterChipText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Dificultad:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedDifficulty && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedDifficulty(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedDifficulty && styles.activeFilterChipText,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.value}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty.value && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedDifficulty(
                selectedDifficulty === difficulty.value ? null : difficulty.value
              )}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDifficulty === difficulty.value && styles.activeFilterChipText,
                ]}
              >
                {difficulty.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4E7BF2" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ProjectDetail', { project: item })}
            >
              <ProjectCard
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                difficulty={item.difficulty}
                category={item.category}
                duration={item.duration}
                onPress={() => navigation.navigate('ProjectDetail', { project: item })}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                No se encontraron proyectos con los filtros seleccionados
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                }}
              >
                <Text style={styles.resetButtonText}>Resetear Filtros</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  activeFilterChip: {
    backgroundColor: '#4E7BF2',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  resetButton: {
    backgroundColor: '#4E7BF2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});