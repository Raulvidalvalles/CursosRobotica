import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ProjectsContext, Project, Category, Difficulty } from '../../contexts/ProjectsContext';
import { toast } from 'sonner-native';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';

type RouteParams = {
  project?: Project;
};

export default function AdminEditProjectScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const projectToEdit = params?.project;
  
  const { addProject, updateProject } = useContext(ProjectsContext);
  
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [category, setCategory] = useState<Category>(projectToEdit?.category || 'electronics');
  const [difficulty, setDifficulty] = useState<Difficulty>(projectToEdit?.difficulty || 'beginner');
  const [duration, setDuration] = useState(projectToEdit?.duration || '');
  const [materials, setMaterials] = useState<string[]>(projectToEdit?.materials || []);
  const [steps, setSteps] = useState<string[]>(projectToEdit?.steps || []);
  const [isAvailable, setIsAvailable] = useState(projectToEdit?.isAvailable !== false);
  const [newMaterial, setNewMaterial] = useState('');
  const [newStep, setNewStep] = useState('');
  const [imageUrl, setImageUrl] = useState(
    projectToEdit?.imageUrl || 
    `https://api.a0.dev/assets/image?text=${encodeURIComponent(title || 'Nuevo Proyecto')}&aspect=1:1`
  );
  
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    duration?: string;
  }>({});
  
  useEffect(() => {
    // Actualizar la URL de la imagen cuando cambie el título
    if (title && !projectToEdit?.imageUrl) {
      setImageUrl(`https://api.a0.dev/assets/image?text=${encodeURIComponent(title)}&aspect=1:1`);
    }
  }, [title]);
  
  const categories = [
    { value: 'mechanics', label: 'Mecánica' },
    { value: 'electronics', label: 'Electrónica' },
    { value: 'programming', label: 'Programación' },
    { value: 'design', label: 'Diseño' },
    { value: 'science', label: 'Ciencia' },
  ];
  
  const difficulties = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
  ];
  
  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, newMaterial.trim()]);
      setNewMaterial('');
    }
  };
  
  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };
  
  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()]);
      setNewStep('');
    }
  };
  
  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const newErrors: any = {};
    
    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!duration.trim()) {
      newErrors.duration = 'La duración es requerida';
    }
    
    if (materials.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un material');
      return false;
    }
    
    if (steps.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un paso');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    const projectData = {
      title,
      description,
      category,
      difficulty,
      duration,
      materials,
      steps,
      isAvailable,
      imageUrl,
    };
    
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, projectData);
        toast.success('Proyecto actualizado con éxito');
      } else {
        await addProject(projectData);
        toast.success('Proyecto creado con éxito');
      }
      navigation.goBack();
    } catch (error) {
      toast.error('Error al guardar el proyecto');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.projectImage} />
          <TouchableOpacity style={styles.changeImageButton}>
            <Ionicons name="camera" size={18} color="white" />
            <Text style={styles.changeImageText}>Cambiar Imagen</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <InputField
            label="Título del Proyecto"
            placeholder="Ej. Robot Seguidor de Líneas"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <InputField
            label="Descripción"
            placeholder="Describe brevemente el proyecto"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.description}
          />
          
          <Text style={styles.sectionTitle}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryOption,
                  category === cat.value && styles.selectedCategory,
                ]}
                onPress={() => setCategory(cat.value as Category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.value && styles.selectedCategoryText,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Nivel de Dificultad</Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff.value}
                style={[
                  styles.difficultyOption,
                  difficulty === diff.value && styles.selectedDifficulty,
                  { 
                    backgroundColor: difficulty === diff.value 
                      ? diff.value === 'beginner' 
                        ? '#4CAF5020'
                        : diff.value === 'intermediate'
                          ? '#FF980020'
                          : '#F4433620'
                      : '#f0f0f0',
                    borderColor: difficulty === diff.value
                      ? diff.value === 'beginner'
                        ? '#4CAF50'
                        : diff.value === 'intermediate'
                          ? '#FF9800'
                          : '#F44336'
                      : '#ddd',
                  },
                ]}
                onPress={() => setDifficulty(diff.value as Difficulty)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { 
                      color: difficulty === diff.value
                        ? diff.value === 'beginner'
                          ? '#4CAF50'
                          : diff.value === 'intermediate'
                            ? '#FF9800'
                            : '#F44336'
                        : '#666',
                    },
                  ]}
                >
                  {diff.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <InputField
            label="Duración Aproximada"
            placeholder="Ej. 2 horas"
            value={duration}
            onChangeText={setDuration}
            error={errors.duration}
          />
          
          <Text style={styles.sectionTitle}>Materiales Necesarios</Text>
          <View style={styles.listInputContainer}>
            <TextInput
              style={styles.listInput}
              placeholder="Añadir material"
              value={newMaterial}
              onChangeText={setNewMaterial}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddMaterial}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {materials.length > 0 && (
            <View style={styles.listContainer}>
              {materials.map((material, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{material}</Text>
                  <TouchableOpacity onPress={() => handleRemoveMaterial(index)}>
                    <Ionicons name="close-circle" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <Text style={styles.sectionTitle}>Pasos de Construcción</Text>
          <View style={styles.listInputContainer}>
            <TextInput
              style={styles.listInput}
              placeholder="Añadir paso"
              value={newStep}
              onChangeText={setNewStep}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {steps.length > 0 && (
            <View style={styles.listContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.listItemText, styles.stepText]}>{step}</Text>
                  <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                    <Ionicons name="close-circle" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Disponible para estudiantes</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: '#ddd', true: '#4E7BF250' }}
              thumbColor={isAvailable ? '#4E7BF2' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title="Cancelar"
              type="secondary"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            <Button
              title={projectToEdit ? "Actualizar Proyecto" : "Crear Proyecto"}
              onPress={handleSave}
              style={styles.saveButton}
            />
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  projectImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeImageText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
  formContainer: {
    padding: 20,
  },
  textArea: {
    height: 100,
    padding: 12,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#4E7BF220',
    borderWidth: 1,
    borderColor: '#4E7BF2',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#4E7BF2',
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDifficulty: {
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 14,
  },
  listInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  listInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4E7BF2',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4E7BF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  stepText: {
    paddingRight: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    marginLeft: 8,
  },
});