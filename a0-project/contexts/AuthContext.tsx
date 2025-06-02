import React, { createContext, useState, useEffect } from 'react';

// Tipos de datos
export type User = {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'student';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

// Datos de ejemplo para usuarios
const SAMPLE_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'estudiante1',
    password: '123456',
    name: 'Carlos García',
    role: 'student' as const,
  },
  {
    id: '3',
    username: 'estudiante2',
    password: '123456',
    name: 'Lucía Martínez',
    role: 'student' as const,
  }
];

// Crear el contexto con un valor predeterminado
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula la verificación de un token guardado
    const checkAuth = async () => {
      const savedUser = await new Promise<User | null>((resolve) => {
        // En producción, aquí verificarías un token real
        setTimeout(() => resolve(null), 500);
      });
      
      setUser(savedUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // Simula una llamada a API de autenticación
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = SAMPLE_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          resolve();
        } else {
          reject(new Error('Credenciales incorrectas'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};