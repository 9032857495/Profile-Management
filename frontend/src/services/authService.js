import axiosInstance from '../utils/axiosInstance'

export const googleLogin = async (credential) => {
  const response = await axiosInstance.post('/api/auth/google', { credential })
  return response.data
}

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me')
  return response.data
}

export const logout = async () => {
  const response = await axiosInstance.post('/api/auth/logout')
  return response.data
}
