import Profile from '../models/Profile.js'

// ─────────────────────────────────────────
// GET /api/profile/me — fetch my profile
// ─────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id })

    if (!profile) {
      profile = new Profile({ userId: req.user._id })  // ← new, not create
      await profile.save()                              // ← save separately
    }

    res.status(200).json({ success: true, profile })
  } catch (error) {
    console.error('getMyProfile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


// ─────────────────────────────────────────
// PATCH /api/profile/me — update my profile
// ─────────────────────────────────────────
export const updateMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id })

    // If no profile exists yet — create one
    if (!profile) {
      profile = new Profile({ userId: req.user._id })
    }

    // Merge incoming fields — only update what's sent
    const allowedFields = [
      'phone', 'city', 'state',
      'college', 'degree', 'branch', 'cgpa', 'graduationYear',
      'skills',
      'certifications',
      'projects',
      'internships',
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field]
      }
    })

    await profile.save() // ← triggers pre('save') → auto-updates completionPercent

    res.status(200).json({ success: true, profile })
  } catch (error) {
    console.error('updateMyProfile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────
// GET /api/profile/:id — view any profile (for ranking later)
// ─────────────────────────────────────────
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id })
      .populate('userId', 'name email avatar')

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json({ success: true, profile })
  } catch (error) {
    console.error('getProfileById error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
