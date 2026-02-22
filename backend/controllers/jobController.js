import getGeminiModel from '../utils/geminiClient.js'
import Profile from '../models/Profile.js'
import AICache from '../models/AICache.js'

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user._id

    // ── Check cache first ──
    const cached = await AICache.findOne({ userId, type: 'jobs' })

    if (cached) {
      const age = Date.now() - new Date(cached.cachedAt).getTime()
      if (age < CACHE_DURATION_MS) {
        console.log('✅ Jobs served from cache for user:', userId)
        return res.status(200).json({
          success: true,
          jobs: cached.data,
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
You are an expert career advisor for students and freshers in India.

Here is a candidate's profile:
- Skills: ${profile.skills.join(', ')}
- CGPA: ${profile.cgpa || 'Not provided'}
- College: ${profile.college || 'Not provided'}
- Branch: ${profile.branch || 'Not provided'}
- Graduation Year: ${profile.graduationYear || 'Not provided'}
- Projects: ${profile.projects?.length > 0 ? profile.projects.map(p => p.title).join(', ') : 'None'}
- Internships: ${profile.internships?.length > 0 ? profile.internships.map(i => `${i.role} at ${i.company}`).join(', ') : 'None'}
- Certifications: ${profile.certifications?.length > 0 ? profile.certifications.map(c => c.title).join(', ') : 'None'}

Based on this profile, recommend exactly 18 job roles best suited for this candidate.

Return ONLY a valid JSON array. No explanation, no markdown, no code block. Just raw JSON.

[
  {
    "title": "Job Title",
    "company": "Example Company Name",
    "type": "Full-time",
    "location": "Remote / Bangalore",
    "salary": "4–6 LPA",
    "matchReason": "2-3 sentence explanation of why this role fits the candidate.",
    "skillsToLearn": ["Skill1", "Skill2"],
    "applyLink": "https://www.linkedin.com/jobs/search/?keywords=Job+Title"
  }
]
`

    const result  = await geminiModel.generateContent(prompt)
    const text    = result.response.text()
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    const jobs    = JSON.parse(cleaned)

    // ── Save to cache (upsert) ──
    await AICache.findOneAndUpdate(
      { userId, type: 'jobs' },
      { data: jobs, cachedAt: new Date() },
      { upsert: true, new: true }
    )
    console.log('✅ Jobs cached for user:', userId)

    return res.status(200).json({ success: true, jobs, fromCache: false })

  } catch (err) {
    console.error('Gemini Job Recommendation Error:', err.message)

    if (err.message?.includes('429') || err.message?.includes('quota')) {
      return res.status(429).json({
        success: false,
        message: 'AI quota limit reached. Please try again in a few minutes.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to generate job recommendations. Please try again.',
    })
  }
}
