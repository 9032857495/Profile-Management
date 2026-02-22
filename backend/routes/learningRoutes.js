import express from 'express'
import { getLearningPaths } from '../controllers/learningController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/learning/paths
router.get('/paths', protect, getLearningPaths)

export default router
