import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=Academia de Robotica&aspect=16:9' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContainer}>
            <Text style={styles.logo}>RoboKids</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            ¡Bienvenidos a la Academia de Robótica!
          </Text>
          <Text style={styles.welcomeText}>
            Donde los niños aprenden robótica de forma divertida y creativa
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar Sesión"
              onPress={() => navigation.navigate('Login' as never)}
              style={styles.loginButton}
              size="large"
            />
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Lo que ofrecemos</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="rocket" size={36} color="#4E7BF2" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Proyectos Emocionantes</Text>
              <Text style={styles.featureText}>
                Construye robots y circuitos que realmente funcionan
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="school" size={36} color="#4E7BF2" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Aprende a tu ritmo</Text>
              <Text style={styles.featureText}>
                Selecciona proyectos según tu nivel y avanza a tu velocidad
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="ribbon" size={36} color="#4E7BF2" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sigue tu progreso</Text>
              <Text style={styles.featureText}>
                Registra los proyectos completados y visualiza tu mejora
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.callToActionSection}>
          <Text style={styles.ctaTitle}>
            ¿Listo para comenzar tu aventura en robótica?
          </Text>
          <Button
            title="Comenzar Ahora"
            onPress={() => navigation.navigate('Login' as never)}
            size="large"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundImage: {
    height: 280,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#f8f9fa',
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 12,
  },
  loginButton: {
    width: '100%',
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  callToActionSection: {
    backgroundColor: '#4E7BF2',
    padding: 24,
    alignItems: 'center',
    borderRadius: 12,
    margin: 24,
    marginTop: 8,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});