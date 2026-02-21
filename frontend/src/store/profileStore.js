import { create } from 'zustand'

const useProfileStore = create((set) => ({
  profile: null,
  isProfileLoading: false,

  // ── Set full profile
  setProfile: (profile) => set({ profile }),

  // ── Update profile fields partially
  updateProfile: (fields) =>
    set((state) => ({
      profile: { ...state.profile, ...fields },
    })),

  // ── Set loading state
  setProfileLoading: (bool) => set({ isProfileLoading: bool }),

  // ── Clear profile (on logout)
  clearProfile: () => set({ profile: null, isProfileLoading: false }),
}))

export default useProfileStore
