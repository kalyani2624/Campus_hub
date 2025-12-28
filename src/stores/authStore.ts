import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  users: { email: string; password: string; name: string }[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      login: (email: string, password: string) => {
        const { users } = get();
        const foundUser = users.find(
          (u) => u.email === email && u.password === password
        );
        if (foundUser) {
          set({
            user: {
              id: foundUser.email,
              name: foundUser.name,
              email: foundUser.email,
            },
          });
          return true;
        }
        return false;
      },
      register: (name: string, email: string, password: string) => {
        const { users } = get();
        const exists = users.find((u) => u.email === email);
        if (exists) return false;
        set({
          users: [...users, { email, password, name }],
          user: { id: email, name, email },
        });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'campus-auth-storage',
    }
  )
);
