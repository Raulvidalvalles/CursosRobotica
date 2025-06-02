import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../contexts/AuthContext';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import { Button } from '../../components/Button';

export default function AdminDashboardScreen() {
  const { user, logout } = useContext(AuthContext);
  const { projects, studentProjects } = useContext(ProjectsContext);
  
  // Calcular métricas
  const totalProjects = projects.length;
  const availableProjects = projects.filter(p => p.isAvailable).length;
  const completedProjects = studentProjects.filter(sp => sp.isCompleted).length;
  const inProgressProjects = studentProjects.length - completedProjects;
  
  const metrics = [
    {
      title: 'Total de Proyectos',
      value: totalProjects,
      icon: 'folder',
      color: '#4E7BF2',
    },
    {
      title: 'Proyectos Disponibles',
      value: availableProjects,
      icon: 'earth',
      color: '#4CAF50',
    },
    {
      title: 'En Progreso',
      value: inProgressProjects,
      icon: 'time',
      color: '#FF9800',
    },
    {
      title: 'Completados',
      value: completedProjects,
      icon: 'checkmark-circle',
      color: '#7E57C2',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color="#4E7BF2" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel de Control</Text>
          
          <View style={styles.metricsContainer}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={[styles.iconContainer, { backgroundColor: `${metric.color}20` }]}>
                  <Ionicons name={metric.icon as any} size={24} color={metric.color} />
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.activityTitle}>Proyecto Completado</Text>
            </View>
            <Text style={styles.activityDescription}>
              Lucía Martínez completó el proyecto "Brazo Robótico"
            </Text>
            <Text style={styles.activityTime}>2 horas atrás</Text>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Ionicons name="play-circle" size={20} color="#FF9800" />
              <Text style={styles.activityTitle}>Proyecto Iniciado</Text>
            </View>
            <Text style={styles.activityDescription}>
              Carlos García comenzó el proyecto "Robot Seguidor de Líneas"
            </Text>
            <Text style={styles.activityTime}>1 día atrás</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#4E7BF220' }]}>
                <Ionicons name="add-circle" size={24} color="#4E7BF2" />
              </View>
              <Text style={styles.actionText}>Nuevo Proyecto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="people" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Ver Estudiantes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#7E57C220' }]}>
                <Ionicons name="stats-chart" size={24} color="#7E57C2" />
              </View>
              <Text style={styles.actionText}>Estadísticas</Text>
            </TouchableOpacity>
          </View>
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
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
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
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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