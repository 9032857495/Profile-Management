import axiosInstance from '../utils/axiosInstance.js'

export const getLearningPaths = async () => {
  const res = await axiosInstance.get('/api/learning/paths')
  return res.data
}
