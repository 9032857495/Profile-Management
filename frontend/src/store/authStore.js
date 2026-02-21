import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,          // ← starts as true until auth check is done

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}))

export default useAuthStore
