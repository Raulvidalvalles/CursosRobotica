import React, { useContext, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { AuthContext } from '../contexts/AuthContext';
import { ProjectsContext, Project } from '../contexts/ProjectsContext';
import { Button } from '../components/Button';

type RouteParams = {
  project: Project & {
    studentProjectId?: string;
    isCompleted?: boolean;
  };
  isAssigned?: boolean;
};

export default function ProjectDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const { project, isAssigned = false } = params;
  
  const { user } = useContext(AuthContext);
  const { assignProject, completeProject } = useContext(ProjectsContext);
  
  const [loading, setLoading] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  const handleAssignProject = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await assignProject(user.id, project.id);
      toast.success('Proyecto asignado correctamente');
      navigation.goBack();
    } catch (error) {
      toast.error('Error al asignar el proyecto');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCompleteProject = async () => {
    if (!user) return;
    
    Alert.alert(
      'Confirmar Finalización',
      '¿Estás seguro que has completado este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setLoading(true);
            try {
              await completeProject(user.id, project.id);
              toast.success('¡Felicidades! Proyecto completado');
              navigation.goBack();
            } catch (error) {
              toast.error('Error al completar el proyecto');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const difficultyColor = {
    beginner: '#4CAF50', // Verde
    intermediate: '#FF9800', // Naranja
    advanced: '#F44336', // Rojo
  };
  
  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return '';
    }
  };
  
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'mechanics': return 'Mecánica';
      case 'electronics': return 'Electrónica';
      case 'programming': return 'Programación';
      case 'design': return 'Diseño';
      case 'science': return 'Ciencia';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: project.imageUrl }} style={styles.projectImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {isAssigned && (
            <View style={[
              styles.statusBadge,
              project.isCompleted ? styles.completedBadge : styles.progressBadge
            ]}>
              <Ionicons 
                name={project.isCompleted ? "checkmark-circle" : "time"} 
                size={16} 
                color="white" 
                style={styles.statusIcon} 
              />
              <Text style={styles.statusText}>
                {project.isCompleted ? "Completado" : "En Progreso"}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{project.title}</Text>
            
            <View style={styles.tagsContainer}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{getCategoryLabel(project.category)}</Text>
              </View>
              
              <View style={[
                styles.difficultyTag, 
                { backgroundColor: difficultyColor[project.difficulty] }
              ]}>
                <Text style={styles.difficultyText}>
                  {getDifficultyLabel(project.difficulty)}
                </Text>
              </View>
              
              <View style={styles.durationTag}>
                <Ionicons name="time-outline" size={14} color="#555" style={styles.durationIcon} />
                <Text style={styles.durationText}>{project.duration}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materiales Necesarios</Text>
            <View style={styles.materialsList}>
              {project.materials.map((material, index) => (
                <View key={index} style={styles.materialItem}>
                  <Ionicons name="ellipse" size={8} color="#4E7BF2" style={styles.bulletPoint} />
                  <Text style={styles.materialText}>{material}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pasos a seguir</Text>
            <View style={styles.stepsList}>
              {project.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {!isAdmin && (
            <View style={styles.actionButtonsContainer}>
              {isAssigned ? (
                project.isCompleted ? (
                  <View style={styles.completedMessageContainer}>
                    <Ionicons name="trophy" size={32} color="#4CAF50" style={styles.trophyIcon} />
                    <Text style={styles.completedMessage}>
                      ¡Has completado este proyecto exitosamente!
                    </Text>
                  </View>
                ) : (
                  <Button
                    title="Marcar como Completado"
                    onPress={handleCompleteProject}
                    disabled={loading}
                    icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
                    style={styles.completeButton}
                  />
                )
              ) : (
                <Button
                  title="Elegir este Proyecto"
                  onPress={handleAssignProject}
                  disabled={loading}
                  icon={<Ionicons name="add-circle" size={20} color="white" />}
                  style={styles.assignButton}
                />
              )}
            </View>
          )}
          
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4E7BF2" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  projectImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#ddd',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  progressBadge: {
    backgroundColor: '#2196F3',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  durationTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    marginRight: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  materialsList: {
    marginTop: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
  },
  materialText: {
    fontSize: 16,
    color: '#555',
  },
  stepsList: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4E7BF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  actionButtonsContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
  assignButton: {
    width: '100%',
  },
  completeButton: {
    width: '100%',
  },
  completedMessageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF5010',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF5050',
  },
  trophyIcon: {
    marginBottom: 12,
  },
  completedMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});