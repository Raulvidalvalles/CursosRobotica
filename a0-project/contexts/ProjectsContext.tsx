import React, { createContext, useState, useEffect } from 'react';

// Tipos de datos para los proyectos
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'mechanics' | 'electronics' | 'programming' | 'design' | 'science';

export type Project = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  imageUrl: string;
  duration: string;
  materials: string[];
  steps: string[];
  createdAt: string;
  isAvailable: boolean;
};

export type StudentProject = {
  id: string;
  projectId: string;
  studentId: string;
  startDate: string;
  completionDate: string | null;
  isCompleted: boolean;
};

type ProjectsContextType = {
  projects: Project[];
  studentProjects: StudentProject[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  assignProject: (studentId: string, projectId: string) => Promise<void>;
  completeProject: (studentId: string, projectId: string) => Promise<void>;
};

// Datos de ejemplo para proyectos
const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Robot Seguidor de Líneas',
    description: 'Construye un robot que pueda seguir un camino marcado en el suelo.',
    difficulty: 'beginner',
    category: 'electronics',
    imageUrl: 'https://api.a0.dev/assets/image?text=Robot Seguidor de Líneas&aspect=1:1',
    duration: '3 horas',
    materials: [
      'Arduino UNO', 
      'Sensores IR', 
      'Motores DC', 
      'Ruedas',
      'Batería'
    ],
    steps: [
      'Ensamblar la estructura base',
      'Conectar motores y ruedas',
      'Conectar sensores IR',
      'Programar el Arduino',
      'Probar en pista'
    ],
    createdAt: '2025-05-20T10:00:00Z',
    isAvailable: true
  },
  {
    id: '2',
    title: 'Brazo Robótico',
    description: 'Construye un brazo robótico que pueda recoger y mover objetos pequeños.',
    difficulty: 'intermediate',
    category: 'mechanics',
    imageUrl: 'https://api.a0.dev/assets/image?text=Brazo Robótico&aspect=1:1',
    duration: '5 horas',
    materials: [
      'Servomotores', 
      'Arduino MEGA', 
      'Piezas impresas en 3D', 
      'Cables',
      'Fuente de alimentación'
    ],
    steps: [
      'Imprimir piezas en 3D',
      'Ensamblar estructura del brazo',
      'Conectar servomotores',
      'Programar movimientos básicos',
      'Calibrar posiciones'
    ],
    createdAt: '2025-05-22T14:30:00Z',
    isAvailable: true
  },
  {
    id: '3',
    title: 'Coche Autónomo',
    description: 'Crea un vehículo que pueda navegar y evitar obstáculos por sí mismo.',
    difficulty: 'advanced',
    category: 'programming',
    imageUrl: 'https://api.a0.dev/assets/image?text=Coche Autónomo&aspect=1:1',
    duration: '8 horas',
    materials: [
      'Raspberry Pi', 
      'Sensor ultrasónico', 
      'Cámara Pi', 
      'Chasis de coche',
      'Baterías recargables'
    ],
    steps: [
      'Montar el chasis con motores',
      'Configurar Raspberry Pi',
      'Instalar sensores y cámara',
      'Programar algoritmos de navegación',
      'Probar en entorno controlado',
      'Refinar algoritmos'
    ],
    createdAt: '2025-05-24T09:15:00Z',
    isAvailable: true
  }
];

// Datos de ejemplo para proyectos asignados a estudiantes
const SAMPLE_STUDENT_PROJECTS: StudentProject[] = [
  {
    id: '1',
    projectId: '1',
    studentId: '2',
    startDate: '2025-06-01T10:00:00Z',
    completionDate: null,
    isCompleted: false
  },
  {
    id: '2',
    projectId: '2',
    studentId: '3',
    startDate: '2025-05-28T14:00:00Z',
    completionDate: '2025-05-30T16:45:00Z',
    isCompleted: true
  }
];

// Crear el contexto con valores predeterminados
export const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  studentProjects: [],
  loading: true,
  error: null,
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  assignProject: async () => {},
  completeProject: async () => {}
});

export const ProjectsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [studentProjects, setStudentProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula una carga de datos desde una API
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProjects(SAMPLE_PROJECTS);
        setStudentProjects(SAMPLE_STUDENT_PROJECTS);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      // Simula una llamada a API para crear un proyecto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject: Project = {
        ...projectData,
        id: `${projects.length + 1}`,
        createdAt: new Date().toISOString()
      };
      
      setProjects([...projects, newProject]);
      setLoading(false);
    } catch (err) {
      setError('Error al crear el proyecto');
      setLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      setLoading(true);
      // Simula una llamada a API para actualizar un proyecto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(projects.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));
      
      setLoading(false);
    } catch (err) {
      setError('Error al actualizar el proyecto');
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      // Simula una llamada a API para eliminar un proyecto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(projects.filter(project => project.id !== id));
      // También eliminamos cualquier asignación de este proyecto a estudiantes
      setStudentProjects(studentProjects.filter(sp => sp.projectId !== id));
      
      setLoading(false);
    } catch (err) {
      setError('Error al eliminar el proyecto');
      setLoading(false);
    }
  };

  const assignProject = async (studentId: string, projectId: string) => {
    try {
      setLoading(true);
      // Simula una llamada a API para asignar un proyecto a un estudiante
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStudentProject: StudentProject = {
        id: `${studentProjects.length + 1}`,
        studentId,
        projectId,
        startDate: new Date().toISOString(),
        completionDate: null,
        isCompleted: false
      };
      
      setStudentProjects([...studentProjects, newStudentProject]);
      setLoading(false);
    } catch (err) {
      setError('Error al asignar el proyecto');
      setLoading(false);
    }
  };

  const completeProject = async (studentId: string, projectId: string) => {
    try {
      setLoading(true);
      // Simula una llamada a API para marcar un proyecto como completado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudentProjects(studentProjects.map(sp => 
        sp.studentId === studentId && sp.projectId === projectId
          ? { 
              ...sp, 
              completionDate: new Date().toISOString(), 
              isCompleted: true 
            }
          : sp
      ));
      
      setLoading(false);
    } catch (err) {
      setError('Error al completar el proyecto');
      setLoading(false);
    }
  };

  return (
    <ProjectsContext.Provider 
      value={{ 
        projects, 
        studentProjects, 
        loading, 
        error,
        addProject,
        updateProject,
        deleteProject,
        assignProject,
        completeProject
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};