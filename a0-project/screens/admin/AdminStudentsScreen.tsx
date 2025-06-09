import React, { useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ListRenderItem
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import { StatusBar } from 'expo-status-bar';

type Student = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  grade: string;
  joinedDate: string;
  projectsCount: number;
  completedCount: number;
};

export default function AdminStudentsScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { studentProjects } = useContext(ProjectsContext);
  
  // Datos de ejemplo - en producción, podrían venir de un contexto o API
  const students = [
    {
      id: '2',
      username: 'estudiante1',
      name: 'Carlos García',
      avatar: `https://api.a0.dev/assets/image?text=CG&aspect=1:1&seed=carlos`,
      grade: '5° Primaria',
      joinedDate: '10/01/2025',
      projectsCount: studentProjects.filter(sp => sp.studentId === '2').length,
      completedCount: studentProjects.filter(sp => sp.studentId === '2' && sp.isCompleted).length,
    },
    {
      id: '3',
      username: 'estudiante2',
      name: 'Lucía Martínez',
      avatar: `https://api.a0.dev/assets/image?text=LM&aspect=1:1&seed=lucia`,
      grade: '6° Primaria',
      joinedDate: '05/02/2025',
      projectsCount: studentProjects.filter(sp => sp.studentId === '3').length,
      completedCount: studentProjects.filter(sp => sp.studentId === '3' && sp.isCompleted).length,
    },
    {
      id: '4',
      username: 'estudiante3',
      name: 'Miguel Torres',
      avatar: `https://api.a0.dev/assets/image?text=MT&aspect=1:1&seed=miguel`,
      grade: '1° Secundaria',
      joinedDate: '15/02/2025',
      projectsCount: studentProjects.filter(sp => sp.studentId === '4').length || 0,
      completedCount: studentProjects.filter(sp => sp.studentId === '4' && sp.isCompleted).length || 0,
    },
    {
      id: '5',
      username: 'estudiante4',
      name: 'Ana Rodríguez',
      avatar: `https://api.a0.dev/assets/image?text=AR&aspect=1:1&seed=ana`,
      grade: '2° Secundaria',
      joinedDate: '03/03/2025',
      projectsCount: studentProjects.filter(sp => sp.studentId === '5').length || 0,
      completedCount: studentProjects.filter(sp => sp.studentId === '5' && sp.isCompleted).length || 0,
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderStudentCard: ListRenderItem<Student> = ({ item }) => {
    const progressPercentage = item.projectsCount > 0
      ? Math.round((item.completedCount / item.projectsCount) * 100)
      : 0;
      
    return (
      <View style={styles.studentCard}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.studentAvatar}
        />
        
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentGrade}>{item.grade}</Text>
          
          <View style={styles.projectsInfo}>
            <View style={styles.statContainer}>
              <Text style={styles.statValue}>{item.projectsCount}</Text>
              <Text style={styles.statLabel}>Proyectos</Text>
            </View>
            
            <View style={styles.statContainer}>
              <Text style={styles.statValue}>{item.completedCount}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            
            <View style={styles.statContainer}>
              <Text style={styles.statValue}>{progressPercentage}%</Text>
              <Text style={styles.statLabel}>Progreso</Text>
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
          
          <Text style={styles.joinedDate}>Se unió el {item.joinedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estudiantes</Text>
        <View style={{ width: 24 }} /> {/* Placeholder para mantener el título centrado */}
      </View>
      
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay estudiantes registrados</Text>
          </View>
        }
      />
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
  listContainer: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  studentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E7BF2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4E7BF2',
    borderRadius: 4,
  },
  joinedDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});