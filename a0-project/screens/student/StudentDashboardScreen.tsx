import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../../contexts/AuthContext';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import type { StudentTabNavigationProp } from '../../types/navigation';

export default function StudentDashboardScreen() {
  const navigation = useNavigation<StudentTabNavigationProp>();
  const { user, logout } = useContext(AuthContext);
  const { projects, studentProjects } = useContext(ProjectsContext);
  
  // Filtrar proyectos donde el estudiante está asignado
  const assignedProjects = studentProjects
    .filter(sp => sp.studentId === user?.id)
    .map(sp => {
      const project = projects.find(p => p.id === sp.projectId);
      if (!project) return null;
      return {
        ...project,
        startDate: sp.startDate,
        completionDate: sp.completionDate,
        isCompleted: sp.isCompleted
      };
    })
    .filter((project): project is NonNullable<typeof project> => project !== null);
  
  // Estadísticas del estudiante
  const totalAssigned = assignedProjects.length;
  const totalCompleted = assignedProjects.filter(p => p?.isCompleted).length;
  const completionPercentage = totalAssigned > 0
    ? Math.round((totalCompleted / totalAssigned) * 100)
    : 0;
  
  // Proyectos recomendados (proyectos disponibles que no han sido asignados al estudiante)
  const recommendedProjects = projects
    .filter(p => p.isAvailable)
    .filter(p => !assignedProjects.some(ap => ap?.id === p.id))
    .slice(0, 3);
  
  const handleGoToProjects = () => {
    navigation.navigate('ProjectsList');
  };
  
  const handleGoToProfile = () => {
    navigation.navigate('StudentProfile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleGoToProfile}
        >
          <Ionicons name="person-circle" size={36} color="#4E7BF2" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Tu Progreso</Text>
          
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#4E7BF220' }]}>
                <Ionicons name="rocket" size={24} color="#4E7BF2" />
              </View>
              <Text style={styles.statValue}>{totalAssigned}</Text>
              <Text style={styles.statLabel}>Proyectos Asignados</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="checkmark-done" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Proyectos Completados</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="pie-chart" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{completionPercentage}%</Text>
              <Text style={styles.statLabel}>Porcentaje</Text>
            </View>
          </View>
        </View>
        
        {/* Current Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Proyectos</Text>
            <TouchableOpacity onPress={handleGoToProfile}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {assignedProjects.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {assignedProjects.slice(0, 3).map((project, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.projectCard}
                  onPress={() => {
                    const baseProject = projects.find(p => p.id === project.id);
                    if (baseProject) navigation.navigate('ProjectDetail', { project: baseProject });
                  }}
                >
                  <Image source={{ uri: project?.imageUrl }} style={styles.projectImage} />
                  <View style={styles.projectCardContent}>
                    <Text style={styles.projectTitle}>{project?.title}</Text>
                    <View style={styles.projectCardFooter}>
                      <View style={[
                        styles.statusBadge,
                        project?.isCompleted ? styles.completedBadge : styles.inProgressBadge
                      ]}>
                        <Text style={styles.statusText}>
                          {project?.isCompleted ? 'Completado' : 'En progreso'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No tienes proyectos asignados actualmente
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={handleGoToProjects}
              >
                <Text style={styles.exploreButtonText}>Explorar Proyectos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Recommended Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proyectos Recomendados</Text>
            <TouchableOpacity onPress={handleGoToProjects}>
              <Text style={styles.seeAllText}>Ver más</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedProjects.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendedProjects.map((project, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.projectCard}
                  onPress={() => {
                    const baseProject = projects.find(p => p.id === project.id);
                    if (baseProject) navigation.navigate('ProjectDetail', { project: baseProject });
                  }}
                >
                  <Image source={{ uri: project.imageUrl }} style={styles.projectImage} />
                  <View style={styles.projectCardContent}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={styles.projectCardFooter}>
                      <View style={[styles.difficultyBadge, {
                        backgroundColor: 
                          project.difficulty === 'beginner' ? '#4CAF5020' :
                          project.difficulty === 'intermediate' ? '#FF980020' : '#F4433620',
                        borderColor:
                          project.difficulty === 'beginner' ? '#4CAF50' :
                          project.difficulty === 'intermediate' ? '#FF9800' : '#F44336',
                      }]}>
                        <Text style={[styles.difficultyText, {
                          color: 
                            project.difficulty === 'beginner' ? '#4CAF50' :
                            project.difficulty === 'intermediate' ? '#FF9800' : '#F44336',
                        }]}>
                          {project.difficulty === 'beginner' ? 'Principiante' :
                            project.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay proyectos recomendados disponibles
              </Text>
            </View>
          )}
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleGoToProjects}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4E7BF220' }]}>
              <Ionicons name="search" size={24} color="#4E7BF2" />
            </View>
            <Text style={styles.actionText}>Explorar Proyectos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleGoToProfile}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF980020' }]}>
              <Ionicons name="stats-chart" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>Tu Progreso</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={logout}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F4433620' }]}>
              <Ionicons name="log-out" size={24} color="#F44336" />
            </View>
            <Text style={styles.actionText}>Cerrar Sesión</Text>
          </TouchableOpacity>
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
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4E7BF2',
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 240,
    marginLeft: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  projectImage: {
    height: 120,
    width: '100%',
    backgroundColor: '#eee',
  },
  projectCardContent: {
    padding: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgressBadge: {
    backgroundColor: '#2196F320',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  completedBadge: {
    backgroundColor: '#4CAF5020',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    marginTop: 0,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  exploreButton: {
    backgroundColor: '#4E7BF2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});