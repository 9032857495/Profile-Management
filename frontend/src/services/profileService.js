import axiosInstance from '../utils/axiosInstance.js'

// ── Fetch my profile
export const getMyProfile = async () => {
  const res = await axiosInstance.get('/api/profile/me')
  return res.data
}

// ── Update my profile (any step)
export const updateMyProfile = async (data) => {
  const res = await axiosInstance.patch('/api/profile/me', data)
  return res.data
}

// ── View any user's profile (for ranking later)
export const getProfileById = async (userId) => {
  const res = await axiosInstance.get(`/api/profile/${userId}`)
  return res.data
}
