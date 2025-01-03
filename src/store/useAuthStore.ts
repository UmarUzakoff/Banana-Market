import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null;
  setAuthenticated: (auth: boolean) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  return {
    isAuthenticated: !!savedToken,
    token: savedToken,
    role: savedRole,
    setAuthenticated: (auth) => {
      set({ isAuthenticated: auth });
      localStorage.setItem("isAuthenticated", String(auth));
    },
    setToken: (token) => {
      set({ token });
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    setRole: (role) => {
      set({ role });
      if (role) {
        localStorage.setItem("role", role);
      } else {
        localStorage.removeItem("role");
      }
    },
    logout: () => {
      set({ isAuthenticated: false, token: null, role: null });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("isAuthenticated");
    },
  };
});
