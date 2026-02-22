import User from '../models/User.js'
import Profile from '../models/Profile.js'

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalCandidates, totalAdmins, totalProfiles, avgScoreAgg] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'candidate' }),
        User.countDocuments({ role: 'admin' }),
        Profile.countDocuments({ score: { $gt: 0 } }),
        Profile.aggregate([
          { $match: { score: { $gt: 0 } } },
          { $group: { _id: null, avgScore: { $avg: '$score' } } },
        ]),
      ])

    const avgScore = avgScoreAgg[0]?.avgScore || 0

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalAdmins,
        totalProfiles,
        averageScore: Number(avgScore.toFixed(1)),
      },
    })
  } catch (err) {
    console.error('Admin Stats Error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to load admin stats',
    })
  }
}

export const getAdminUsers = async (req, res) => {
  try {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const skip  = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name email role createdAt'),
      User.countDocuments(),
    ])

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('Admin Users Error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to load users',
    })
  }
}
