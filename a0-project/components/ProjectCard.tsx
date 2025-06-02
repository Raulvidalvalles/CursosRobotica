import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Difficulty, Category } from '../contexts/ProjectsContext';

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  category: Category;
  duration: string;
  onPress: () => void;
  isAssigned?: boolean;
  isCompleted?: boolean;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  difficulty,
  category,
  duration,
  onPress,
  isAssigned = false,
  isCompleted = false,
}) => {
  const difficultyColor = {
    beginner: '#4CAF50', // Verde
    intermediate: '#FF9800', // Naranja
    advanced: '#F44336', // Rojo
  };

  const categoryIcon = {
    mechanics: 'cog',
    electronics: 'flash',
    programming: 'code-slash',
    design: 'color-palette',
    science: 'flask',
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return '';
    }
  };

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'mechanics':
        return 'Mecánica';
      case 'electronics':
        return 'Electrónica';
      case 'programming':
        return 'Programación';
      case 'design':
        return 'Diseño';
      case 'science':
        return 'Ciencia';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.tagsContainer}>
          <View
            style={[
              styles.difficultyTag,
              { backgroundColor: difficultyColor[difficulty] },
            ]}
          >
            <Text style={styles.tagText}>{getDifficultyLabel(difficulty)}</Text>
          </View>
          
          <View style={styles.categoryTag}>
            <Ionicons
              name={categoryIcon[category]}
              size={14}
              color="#333"
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>{getCategoryLabel(category)}</Text>
          </View>
          
          <View style={styles.durationTag}>
            <Ionicons name="time-outline" size={14} color="#555" />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        {isAssigned && (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusTag,
                isCompleted ? styles.completedTag : styles.assignedTag,
              ]}
            >
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'hourglass'}
                size={14}
                color={isCompleted ? 'white' : 'white'}
              />
              <Text style={styles.statusText}>
                {isCompleted ? 'Completado' : 'En progreso'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    height: 160,
    width: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  assignedTag: {
    backgroundColor: '#2196F3',
  },
  completedTag: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
});