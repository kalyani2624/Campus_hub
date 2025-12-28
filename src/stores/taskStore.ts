import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getUserTasks: (userId: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ tasks: [...get().tasks, newTask] });
      },
      
      toggleComplete: (taskId: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        });
      },
      
      deleteTask: (taskId: string) => {
        set({ tasks: get().tasks.filter((t) => t.id !== taskId) });
      },
      
      getUserTasks: (userId: string) => {
        return get().tasks.filter((t) => t.userId === userId);
      },
    }),
    {
      name: 'campus-task-storage',
    }
  )
);
