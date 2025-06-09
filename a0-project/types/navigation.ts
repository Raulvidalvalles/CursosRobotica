// Navigation types for the app
import type { Project } from '../contexts/ProjectsContext';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminTabs: undefined;
  StudentTabs: undefined;
  AdminEditProject: { project: Project | null };
  AdminStudents: undefined;
  AdminStatistics: undefined;
  ProjectDetail: { project: Project };
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  AdminProjects: undefined;
};

export type StudentTabParamList = {
  StudentDashboard: undefined;
  ProjectsList: undefined;
  StudentProfile: undefined;
};

export type StudentTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<StudentTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
