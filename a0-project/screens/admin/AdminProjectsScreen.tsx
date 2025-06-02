import React, { useContext, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ProjectsContext, Project } from '../../contexts/ProjectsContext';
import { Button } from '../../components/Button';
import { ProjectCard } from '../../components/ProjectCard';
import { toast } from 'sonner-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AdminProjectsScreen() {
  const navigation = useNavigation();
  const { projects, loading, deleteProject } = useContext(ProjectsContext);
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
  const filteredProjects = projects.filter(project => {
    let matchesCategory = true;
    let matchesDifficulty = true;
    
    if (selectedCategory) {
      matchesCategory = project.category === selectedCategory;
    }
    
    if (selectedDifficulty) {
      matchesDifficulty = project.difficulty === selectedDifficulty;
    }
    
    return matchesCategory && matchesDifficulty;
  });
  
  const handleCreateProject = () => {
    navigation.navigate('AdminEditProject' as never, { project: null } as never);
  };
  
  const handleEditProject = (project: Project) => {
    navigation.navigate('AdminEditProject' as never, { project } as never);
  };
  
  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar el proyecto "${project.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
              toast.success('Proyecto eliminado con éxito');
            } catch (error) {
              toast.error('Error al eliminar el proyecto');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Proyectos</Text>
        <Button 
          title="Nuevo Proyecto" 
          icon={<Ionicons name="add" size={18} color="white" />}
          onPress={handleCreateProject}
          size="small"
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Filtros:</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              !selectedCategory && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.filterTabText,
              !selectedCategory && styles.activeFilterTabText,
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.filterTab,
                selectedCategory === category.value && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedCategory === category.value && styles.activeFilterTabText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              !selectedDifficulty && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedDifficulty(null)}
          >
            <Text style={[
              styles.filterTabText,
              !selectedDifficulty && styles.activeFilterTabText,
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.value}
              style={[
                styles.filterTab,
                selectedDifficulty === difficulty.value && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedDifficulty(difficulty.value)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedDifficulty === difficulty.value && styles.activeFilterTabText,
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
            <View style={styles.projectCardContainer}>
              <ProjectCard
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                difficulty={item.difficulty}
                category={item.category}
                duration={item.duration}
                onPress={() => handleEditProject(item)}
              />
              <View style={styles.actionsContainer}>
                <Button
                  title="Editar"
                  type="secondary"
                  size="small"
                  icon={<Ionicons name="create-outline" size={16} color="#4E7BF2" />}
                  onPress={() => handleEditProject(item)}
                  style={styles.actionButton}
                />
                <Button
                  title="Eliminar"
                  type="danger"
                  size="small"
                  icon={<Ionicons name="trash-outline" size={16} color="white" />}
                  onPress={() => handleDeleteProject(item)}
                  style={styles.actionButton}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay proyectos disponibles</Text>
              <Button 
                title="Crear Proyecto" 
                onPress={handleCreateProject}
                style={styles.emptyButton}
              />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  filterTabsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#4E7BF2',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  projectCardContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
});