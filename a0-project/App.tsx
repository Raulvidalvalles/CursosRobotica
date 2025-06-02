import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';

// Importación de contextos
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ProjectsProvider } from './contexts/ProjectsContext';

// Importación de pantallas
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import AdminProjectsScreen from "./screens/admin/AdminProjectsScreen";
import AdminEditProjectScreen from "./screens/admin/AdminEditProjectScreen";
import AdminStudentsScreen from "./screens/admin/AdminStudentsScreen"; // Nueva pantalla
import AdminStatisticsScreen from "./screens/admin/AdminStatisticsScreen"; // Nueva pantalla
import StudentDashboardScreen from "./screens/student/StudentDashboardScreen";
import ProjectsListScreen from "./screens/student/ProjectsListScreen";
import StudentProfileScreen from "./screens/student/StudentProfileScreen";
import ProjectDetailScreen from "./screens/ProjectDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación para administradores
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'AdminDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AdminProjects') {
            iconName = focused ? 'folder' : 'folder-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ title: 'Panel' }}
      />
      <Tab.Screen 
        name="AdminProjects" 
        component={AdminProjectsScreen} 
        options={{ title: 'Proyectos' }}
      />
    </Tab.Navigator>
  );
}

// Navegación para estudiantes
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'StudentDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProjectsList') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'StudentProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="StudentDashboard" 
        component={StudentDashboardScreen} 
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="ProjectsList" 
        component={ProjectsListScreen} 
        options={{ title: 'Proyectos' }}
      />
      <Tab.Screen 
        name="StudentProfile" 
        component={StudentProfileScreen} 
        options={{ title: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Navegación principal con autenticación
function AppNavigator() {
  const { user } = useContext(AuthContext);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : user.role === 'admin' ? (
        <>
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
          <Stack.Screen 
            name="AdminEditProject" 
            component={AdminEditProjectScreen}
            options={{ headerShown: true, title: 'Editar Proyecto' }}
          />
          <Stack.Screen 
            name="AdminStudents" 
            component={AdminStudentsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminStatistics" 
            component={AdminStatisticsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProjectDetail" 
            component={ProjectDetailScreen}
            options={{ headerShown: true, title: 'Detalles del Proyecto' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="StudentTabs" component={StudentTabs} />
          <Stack.Screen 
            name="ProjectDetail" 
            component={ProjectDetailScreen}
            options={{ headerShown: true, title: 'Detalles del Proyecto' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AuthProvider>
        <ProjectsProvider>
          <Toaster />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ProjectsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});