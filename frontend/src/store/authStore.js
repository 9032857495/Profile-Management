import { create } from 'zustand'
import useProfileStore from './profileStore.js'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    useProfileStore.getState().clearProfile()  // ← clear profile on logout
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
}))

export default useAuthStore
