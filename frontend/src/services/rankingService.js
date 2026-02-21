import axiosInstance from '../utils/axiosInstance.js'

export const getGlobalRankings  = async () => {
  const res = await axiosInstance.get('/api/rankings/global')
  return res.data
}

export const getCollegeRankings = async () => {
  const res = await axiosInstance.get('/api/rankings/college')
  return res.data
}

export const getCityRankings    = async () => {
  const res = await axiosInstance.get('/api/rankings/city')
  return res.data
}
