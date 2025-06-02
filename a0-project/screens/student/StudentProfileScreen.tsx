import React, { useContext, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image,
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import { Button } from '../../components/Button';
import { ProjectCard } from '../../components/ProjectCard';

export default function StudentProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { projects, studentProjects } = useContext(ProjectsContext);
  
  // Filtrar proyectos asignados al estudiante
  const assignedProjects = useMemo(() => {
    return studentProjects
      .filter(sp => sp.studentId === user?.id)
      .map(sp => {
        const project = projects.find(p => p.id === sp.projectId);
        return {
          ...project,
          studentProjectId: sp.id,
          startDate: sp.startDate,
          completionDate: sp.completionDate,
          isCompleted: sp.isCompleted
        };
      })
      .filter(Boolean);
  }, [studentProjects, projects, user]);
  
  // Proyectos completados
  const completedProjects = useMemo(() => {
    return assignedProjects.filter(project => project?.isCompleted);
  }, [assignedProjects]);
  
  // Proyectos en progreso
  const inProgressProjects = useMemo(() => {
    return assignedProjects.filter(project => !project?.isCompleted);
  }, [assignedProjects]);
  
  // Estadísticas del estudiante
  const totalAssigned = assignedProjects.length;
  const totalCompleted = completedProjects.length;
  const completionPercentage = totalAssigned > 0 
    ? Math.round((totalCompleted / totalAssigned) * 100) 
    : 0;
  
  // Distribución por categorías
  const categoryDistribution = useMemo(() => {
    const distribution = { mechanics: 0, electronics: 0, programming: 0, design: 0, science: 0 };
    
    assignedProjects.forEach(project => {
      if (project?.category) {
        distribution[project.category]++;
      }
    });
    
    return Object.entries(distribution).map(([category, count]) => ({
      category,
      count,
      percentage: totalAssigned > 0 ? Math.round((count / totalAssigned) * 100) : 0
    }));
  }, [assignedProjects, totalAssigned]);
  
  // Categoría favorita
  const favoriteCategory = useMemo(() => {
    if (categoryDistribution.length === 0 || totalAssigned === 0) return null;
    
    return categoryDistribution.reduce((prev, current) => 
      (current.count > prev.count) ? current : prev
    );
  }, [categoryDistribution, totalAssigned]);
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mechanics': return 'Mecánica';
      case 'electronics': return 'Electrónica';
      case 'programming': return 'Programación';
      case 'design': return 'Diseño';
      case 'science': return 'Ciencia';
      default: return 'Desconocido';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerProfile}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>Estudiante</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Mis Estadísticas</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalAssigned}</Text>
              <Text style={styles.statLabel}>Proyectos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionPercentage}%</Text>
              <Text style={styles.statLabel}>Completado</Text>
            </View>
          </View>
          
          {favoriteCategory && totalAssigned > 0 && (
            <View style={styles.favoriteCategory}>
              <Text style={styles.favoriteCategoryLabel}>Tu categoría favorita:</Text>
              <View style={styles.favoriteCategoryContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryLabel}>
                    {getCategoryLabel(favoriteCategory.category)}
                  </Text>
                </View>
                <Text style={styles.categoryPercentage}>
                  {favoriteCategory.percentage}% de tus proyectos
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Proyectos En Progreso</Text>
          
          {inProgressProjects.length > 0 ? (
            inProgressProjects.map((project, index) => (
              <ProjectCard
                key={index}
                id={project?.id || ''}
                title={project?.title || ''}
                description={project?.description || ''}
                imageUrl={project?.imageUrl || ''}
                difficulty={project?.difficulty || 'beginner'}
                category={project?.category || 'electronics'}
                duration={project?.duration || ''}
                isAssigned
                isCompleted={false}
                onPress={() => navigation.navigate('ProjectDetail' as never, { 
                  project, isAssigned: true 
                } as never)}
              />
            ))
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="hourglass-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No tienes proyectos en progreso</Text>
              <Button
                title="Explorar Proyectos"
                size="small"
                onPress={() => navigation.navigate('ProjectsList' as never)}
                style={styles.exploreButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Proyectos Completados</Text>
          
          {completedProjects.length > 0 ? (
            completedProjects.map((project, index) => (
              <ProjectCard
                key={index}
                id={project?.id || ''}
                title={project?.title || ''}
                description={project?.description || ''}
                imageUrl={project?.imageUrl || ''}
                difficulty={project?.difficulty || 'beginner'}
                category={project?.category || 'electronics'}
                duration={project?.duration || ''}
                isAssigned
                isCompleted
                onPress={() => navigation.navigate('ProjectDetail' as never, { 
                  project, isAssigned: true 
                } as never)}
              />
            ))
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="checkmark-done-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>Aún no has completado ningún proyecto</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Cerrar Sesión"
            type="danger"
            onPress={logout}
            style={styles.logoutButton}
            icon={<Ionicons name="log-out-outline" size={20} color="white" />}
          />
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
    backgroundColor: '#4E7BF2',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  statsCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E7BF2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  favoriteCategory: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  favoriteCategoryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  favoriteCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#4E7BF220',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E7BF2',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  exploreButton: {
    marginTop: 8,
  },
  actionButtons: {
    padding: 16,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    width: '100%',
  },
});