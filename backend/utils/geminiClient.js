import { GoogleGenerativeAI } from '@google/generative-ai'

const getGeminiModel = () => {
  const API_KEY = process.env.GEMINI_API_KEY?.trim()
  const genAI = new GoogleGenerativeAI(API_KEY)
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
}

export default getGeminiModel
