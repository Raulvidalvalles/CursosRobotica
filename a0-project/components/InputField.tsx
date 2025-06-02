import { StyleSheet, Text, View, TextInput, TextInputProps, ViewStyle } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type InputFieldProps = TextInputProps & {
  label: string;
  icon?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        {icon && (
          <Ionicons name={icon as any} size={20} color="#666" style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
  },
});