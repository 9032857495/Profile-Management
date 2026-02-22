import getGeminiModel from '../utils/geminiClient.js'
import Profile from '../models/Profile.js'
import AICache from '../models/AICache.js'

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export const getLearningPaths = async (req, res) => {
  try {
    const userId = req.user._id

    // ── Check cache first ──
    const cached = await AICache.findOne({ userId, type: 'learning' })

    if (cached) {
      const age = Date.now() - new Date(cached.cachedAt).getTime()
      if (age < CACHE_DURATION_MS) {
        console.log('✅ Learning paths served from cache for user:', userId)
        return res.status(200).json({
          success: true,
          paths: cached.data,
          fromCache: true,
        })
      }
    }

    // ── No cache or expired — fetch profile ──
    const profile = await Profile.findOne({ userId })

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete your profile first.',
      })
    }

    if (!profile.skills || profile.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least some skills to your profile first.',
      })
    }

    // ── Call Gemini ──
    const geminiModel = getGeminiModel()

    const prompt = `
You are an expert career coach and technical mentor for students in India.

Here is a candidate's profile:
- Skills: ${profile.skills.join(', ')}
- CGPA: ${profile.cgpa || 'Not provided'}
- College: ${profile.college || 'Not provided'}
- Branch: ${profile.branch || 'Not provided'}
- Graduation Year: ${profile.graduationYear || 'Not provided'}
- Projects: ${profile.projects?.length > 0 ? profile.projects.map(p => p.title).join(', ') : 'None'}
- Internships: ${profile.internships?.length > 0 ? profile.internships.map(i => `${i.role} at ${i.company}`).join(', ') : 'None'}
- Certifications: ${profile.certifications?.length > 0 ? profile.certifications.map(c => c.title).join(', ') : 'None'}

Based on this profile, generate exactly 4 personalized learning path roadmaps.
Each path should target a different career direction.
Each path must have exactly 5 steps.

Return ONLY a valid JSON array. No explanation, no markdown, no code block. Just raw JSON.

[
  {
    "careerGoal": "Full Stack Developer",
    "difficulty": "Intermediate",
    "estimatedTime": "8 weeks",
    "description": "1-2 sentence description of this path.",
    "steps": [
      {
        "order": 1,
        "topic": "Topic Name",
        "duration": "1 week",
        "description": "Short description of what to learn.",
        "resourceLink": "https://...",
        "resourceLabel": "Resource Name"
      }
    ]
  }
]
`

    const result  = await geminiModel.generateContent(prompt)
    const text    = result.response.text()
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    const paths   = JSON.parse(cleaned)

    // ── Save to cache (upsert) ──
    await AICache.findOneAndUpdate(
      { userId, type: 'learning' },
      { data: paths, cachedAt: new Date() },
      { upsert: true, new: true }
    )
    console.log('✅ Learning paths cached for user:', userId)

    return res.status(200).json({ success: true, paths, fromCache: false })

  } catch (err) {
    console.error('Gemini Learning Paths Error:', err.message)

    if (err.message?.includes('429') || err.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'AI quota limit reached. Please try again in a few minutes.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to generate learning paths. Please try again.',
    })
  }
}
