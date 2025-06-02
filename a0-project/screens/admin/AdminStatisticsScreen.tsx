import React, { useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import { StatusBar } from 'expo-status-bar';

export default function AdminStatisticsScreen() {
  const navigation = useNavigation();
  const { projects, studentProjects } = useContext(ProjectsContext);
  
  // Calcular estadísticas generales
  const totalProjects = projects.length;
  const totalCompleted = studentProjects.filter(sp => sp.isCompleted).length;
  const totalInProgress = studentProjects.length - totalCompleted;
  
  // Estadísticas por categoría
  const categoryStats = {
    mechanics: {
      total: projects.filter(p => p.category === 'mechanics').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.category === 'mechanics' && sp.isCompleted;
      }).length
    },
    electronics: {
      total: projects.filter(p => p.category === 'electronics').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.category === 'electronics' && sp.isCompleted;
      }).length
    },
    programming: {
      total: projects.filter(p => p.category === 'programming').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.category === 'programming' && sp.isCompleted;
      }).length
    },
    design: {
      total: projects.filter(p => p.category === 'design').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.category === 'design' && sp.isCompleted;
      }).length
    },
    science: {
      total: projects.filter(p => p.category === 'science').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.category === 'science' && sp.isCompleted;
      }).length
    }
  };
  
  // Estadísticas por dificultad
  const difficultyStats = {
    beginner: {
      total: projects.filter(p => p.difficulty === 'beginner').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.difficulty === 'beginner' && sp.isCompleted;
      }).length
    },
    intermediate: {
      total: projects.filter(p => p.difficulty === 'intermediate').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.difficulty === 'intermediate' && sp.isCompleted;
      }).length
    },
    advanced: {
      total: projects.filter(p => p.difficulty === 'advanced').length,
      completed: studentProjects.filter(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return project?.difficulty === 'advanced' && sp.isCompleted;
      }).length
    }
  };
  
  // Estadísticas por estudiante
  const studentStats = [
    {
      id: '2',
      name: 'Carlos García',
      avatar: `https://api.a0.dev/assets/image?text=CG&aspect=1:1&seed=carlos`,
      total: studentProjects.filter(sp => sp.studentId === '2').length,
      completed: studentProjects.filter(sp => sp.studentId === '2' && sp.isCompleted).length,
    },
    {
      id: '3',
      name: 'Lucía Martínez',
      avatar: `https://api.a0.dev/assets/image?text=LM&aspect=1:1&seed=lucia`,
      total: studentProjects.filter(sp => sp.studentId === '3').length,
      completed: studentProjects.filter(sp => sp.studentId === '3' && sp.isCompleted).length,
    }
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* General Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#4E7BF220' }]}>
                <Ionicons name="folder" size={24} color="#4E7BF2" />
              </View>
              <Text style={styles.statValue}>{totalProjects}</Text>
              <Text style={styles.statLabel}>Proyectos Totales</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="checkmark-done" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Proyectos Completados</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="time" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{totalInProgress}</Text>
              <Text style={styles.statLabel}>Proyectos en Progreso</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B020' }]}>
                <Ionicons name="people" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.statValue}>{studentStats.length}</Text>
              <Text style={styles.statLabel}>Estudiantes Activos</Text>
            </View>
          </View>
        </View>
        
        {/* Category Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por Categoría</Text>
          
          <View style={styles.barChartContainer}>
            {Object.entries(categoryStats).map(([key, value]) => {
              const categoryName = {
                mechanics: 'Mecánica',
                electronics: 'Electrónica',
                programming: 'Programación',
                design: 'Diseño',
                science: 'Ciencia'
              }[key];
              
              const percentage = value.total > 0 ? (value.completed / value.total) * 100 : 0;
              
              return (
                <View key={key} style={styles.barChartItem}>
                  <View style={styles.barLabelContainer}>
                    <Text style={styles.barLabel}>{categoryName}</Text>
                    <Text style={styles.barValue}>{value.completed}/{value.total}</Text>
                  </View>
                  
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { width: `${percentage}%` },
                        { backgroundColor: key === 'mechanics' ? '#4E7BF2' : 
                                          key === 'electronics' ? '#4CAF50' :
                                          key === 'programming' ? '#FF9800' :
                                          key === 'design' ? '#E91E63' :
                                          '#9C27B0' }
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Difficulty Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por Dificultad</Text>
          
          <View style={styles.barChartContainer}>
            {Object.entries(difficultyStats).map(([key, value]) => {
              const difficultyName = {
                beginner: 'Principiante',
                intermediate: 'Intermedio',
                advanced: 'Avanzado'
              }[key];
              
              const percentage = value.total > 0 ? (value.completed / value.total) * 100 : 0;
              const color = key === 'beginner' ? '#4CAF50' : 
                          key === 'intermediate' ? '#FF9800' : '#F44336';
              
              return (
                <View key={key} style={styles.barChartItem}>
                  <View style={styles.barLabelContainer}>
                    <Text style={styles.barLabel}>{difficultyName}</Text>
                    <Text style={styles.barValue}>{value.completed}/{value.total}</Text>
                  </View>
                  
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { width: `${percentage}%` },
                        { backgroundColor: color }
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Student Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por Estudiante</Text>
          
          {studentStats.map((student) => {
            const progressPercentage = student.total > 0
              ? Math.round((student.completed / student.total) * 100)
              : 0;
              
            return (
              <View key={student.id} style={styles.studentStatCard}>
                <View style={styles.studentHeader}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.completionBadge}>
                    <Text style={styles.completionText}>{progressPercentage}%</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${progressPercentage}%` },
                      progressPercentage > 0 ? { backgroundColor: progressPercentage >= 75 ? '#4CAF50' : '#FF9800' } : {}
                    ]}
                  />
                </View>
                
                <View style={styles.studentDetailsContainer}>
                  <Text style={styles.detailText}>Completados: {student.completed}</Text>
                  <Text style={styles.detailText}>Total: {student.total}</Text>
                </View>
              </View>
            );
          })}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  barChartContainer: {
    marginTop: 8,
  },
  barChartItem: {
    marginBottom: 16,
  },
  barLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  barValue: {
    fontSize: 14,
    color: '#666',
  },
  barContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  bar: {
    height: 12,
    borderRadius: 6,
  },
  studentStatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  completionBadge: {
    backgroundColor: '#4E7BF220',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    color: '#4E7BF2',
    fontWeight: '600',
    fontSize: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4E7BF2',
    borderRadius: 4,
  },
  studentDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});