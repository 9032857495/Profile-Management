import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getMyProfile,
  updateMyProfile,
  getProfileById,
} from '../controllers/profileController.js'

const router = express.Router()

// ── All routes protected (must be logged in) ──

// GET  /api/profile/me     → fetch my profile
router.get('/me', protect, getMyProfile)

// PATCH /api/profile/me    → update my profile (any step)
router.patch('/me', protect, updateMyProfile)

// GET  /api/profile/:id    → view any user's profile
router.get('/:id', protect, getProfileById)

export default router
