import Profile from '../models/Profile.js'
import User    from '../models/User.js'

// ── Helper: format rank list ──
const formatRankings = (profiles, currentUserId) => {
  return profiles.map((profile, index) => ({
    rank:    index + 1,
    userId:  profile.userId?._id,
    name:    profile.userId?.name   || 'Unknown',
    avatar:  profile.userId?.name?.charAt(0).toUpperCase() || '?',
    college: profile.college        || '—',
    branch:  profile.branch         || '—',
    score:   profile.score          || 0,
    cgpa:    profile.cgpa           || null,
    isMe:    profile.userId?._id?.toString() === currentUserId.toString(),
  }))
}

// ── Sort logic: score → cgpa → skills count → createdAt ──
const rankingSort = { 
  score:          -1,
  cgpa:           -1,
  'skills.length': -1,
  createdAt:       1,
}

// ─────────────────────────────────────────
// GET /api/rankings/global
// ─────────────────────────────────────────
export const getGlobalRankings = async (req, res) => {
  try {
    const profiles = await Profile
      .find({ score: { $gt: 0 } })          // only users with a score
      .sort(rankingSort)
      .populate('userId', 'name')
      .select('userId college branch score cgpa skills createdAt')
      .limit(100)                            // top 100

    const rankings  = formatRankings(profiles, req.user._id)
    const myRank    = rankings.find((r) => r.isMe)

    res.status(200).json({
      success:  true,
      total:    rankings.length,
      myRank:   myRank?.rank || null,
      rankings,
    })
  } catch (error) {
    console.error('getGlobalRankings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────
// GET /api/rankings/college
// ─────────────────────────────────────────
export const getCollegeRankings = async (req, res) => {
  try {
    // Get current user's college first
    const myProfile = await Profile.findOne({ userId: req.user._id })

    if (!myProfile?.college) {
      return res.status(200).json({
        success:  true,
        total:    0,
        myRank:   null,
        college:  null,
        rankings: [],
        message:  'Add your college to see college rankings.',
      })
    }

    const profiles = await Profile
      .find({
        college: myProfile.college,          // same college only
        score:   { $gt: 0 },
      })
      .sort(rankingSort)
      .populate('userId', 'name')
      .select('userId college branch score cgpa skills createdAt')

    const rankings = formatRankings(profiles, req.user._id)
    const myRank   = rankings.find((r) => r.isMe)

    res.status(200).json({
      success:  true,
      total:    rankings.length,
      myRank:   myRank?.rank || null,
      college:  myProfile.college,
      rankings,
    })
  } catch (error) {
    console.error('getCollegeRankings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────
// GET /api/rankings/city
// ─────────────────────────────────────────
export const getCityRankings = async (req, res) => {
  try {
    // Get current user's city first
    const myProfile = await Profile.findOne({ userId: req.user._id })

    if (!myProfile?.city) {
      return res.status(200).json({
        success:  true,
        total:    0,
        myRank:   null,
        city:     null,
        rankings: [],
        message:  'Add your city to see local rankings.',
      })
    }

    const profiles = await Profile
      .find({
        city:  myProfile.city,               // same city only
        score: { $gt: 0 },
      })
      .sort(rankingSort)
      .populate('userId', 'name')
      .select('userId college branch score cgpa skills createdAt')

    const rankings = formatRankings(profiles, req.user._id)
    const myRank   = rankings.find((r) => r.isMe)

    res.status(200).json({
      success:  true,
      total:    rankings.length,
      myRank:   myRank?.rank || null,
      city:     myProfile.city,
      rankings,
    })
  } catch (error) {
    console.error('getCityRankings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
