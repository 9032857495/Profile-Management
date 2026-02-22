import express from 'express'
import { getJobRecommendations } from '../controllers/jobController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/jobs/recommendations
router.get('/recommendations', protect, getJobRecommendations)

export default router
