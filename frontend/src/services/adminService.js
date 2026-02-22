import axiosInstance from '../utils/axiosInstance.js'

export const getAdminStats = async () => {
  const res = await axiosInstance.get('/api/admin/stats')
  return res.data
}

export const getAdminUsers = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get(`/api/admin/users?page=${page}&limit=${limit}`)
  return res.data
}
