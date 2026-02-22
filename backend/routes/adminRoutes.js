import express from 'express'
import { getAdminStats, getAdminUsers } from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.get('/stats',  protect, adminOnly, getAdminStats)
router.get('/users',  protect, adminOnly, getAdminUsers)

export default router
