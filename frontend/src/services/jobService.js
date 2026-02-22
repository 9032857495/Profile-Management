import axiosInstance from '../utils/axiosInstance.js'

export const getJobRecommendations = async () => {
  const res = await axiosInstance.get('/api/jobs/recommendations')
  return res.data
}
