import express from 'express'
import {
  getGlobalRankings,
  getCollegeRankings,
  getCityRankings,
} from '../controllers/rankingController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All ranking routes are protected
router.get('/global',  protect, getGlobalRankings)
router.get('/college', protect, getCollegeRankings)
router.get('/city',    protect, getCityRankings)

export default router
