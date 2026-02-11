import { create } from "zustand";
import { login, register } from "../services/authService";
import { clearToken, setToken, getToken } from "../services/remote";

type AuthState = {
  token: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  email: null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await login({ email, password });
      setToken(response.token);
      set({ token: response.token, email: response.email, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Login failed", loading: false });
      throw error;
    }
  },
  register: async (email, password, firstName, lastName) => {
    set({ loading: true, error: null });
    try {
      const response = await register({ email, password, firstName, lastName });
      setToken(response.token);
      set({ token: response.token, email: response.email, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Registration failed", loading: false });
      throw error;
    }
  },
  logout: () => {
    clearToken();
    set({ token: null, email: null });
  }
}));
