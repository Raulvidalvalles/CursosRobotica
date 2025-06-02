import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner-native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string, password?: string}>({});

  const validateForm = () => {
    const newErrors: {username?: string, password?: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await login(username, password);
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      toast.error('Credenciales incorrectas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=RoboKids&aspect=1:1' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>RoboKids</Text>
          <Text style={styles.tagline}>Academia de Robótica para Niños</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>
          
          <InputField
            label="Nombre de Usuario"
            placeholder="Ingresa tu nombre de usuario"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            icon="person-outline"
            error={errors.username}
          />
          
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />
          
          <View style={styles.loginButtonContainer}>
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              disabled={loading}
              size="large"
              style={styles.loginButton}
            />
          </View>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>Credenciales de prueba:</Text>
            <Text style={styles.credText}>Admin: admin / admin123</Text>
            <Text style={styles.credText}>Estudiante: estudiante1 / 123456</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7BF2',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  loginButtonContainer: {
    marginTop: 20,
  },
  loginButton: {
    width: '100%',
  },
  helpSection: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  credText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  }
});