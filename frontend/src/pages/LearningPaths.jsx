import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getLearningPaths } from '../services/learningService'

const difficultyConfig = {
  Beginner:     { color: 'bg-green-50 text-green-600 border-green-200',  dot: 'bg-green-500'  },
  Intermediate: { color: 'bg-amber-50 text-amber-600 border-amber-200',  dot: 'bg-amber-500'  },
  Advanced:     { color: 'bg-red-50 text-red-600 border-red-200',        dot: 'bg-red-500'    },
}

const LearningPaths = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate            = useNavigate()
  const [paths, setPaths]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [expanded, setExpanded] = useState(null) // which path is expanded

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLearningPaths()
        if (data.success) {
          setPaths(data.paths)
          setExpanded(0) // first path open by default
        } else {
          setError(data.message)
        }
      } catch (err) {
        const message = err?.response?.data?.message
          || 'Failed to load learning paths. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Loading ──
  if (loading) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex flex-col items-center justify-center
                   bg-gradient-to-br from-slate-50 via-white to-blue-50 gap-4"
      >
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent
                        rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">
          AI is generating your personalized learning paths...
        </p>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex flex-col items-center justify-center
                   bg-gradient-to-br from-slate-50 via-white to-blue-50 gap-4"
      >
        <span className="text-4xl">⚠️</span>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => navigate('/profile/build')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm
                     font-semibold hover:bg-blue-700 transition-all"
        >
          Complete Your Profile →
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-4xl flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛤️</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Learning Paths
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-9">
            AI-generated roadmaps to help you grow based on your current skills.
          </p>
        </div>

        {/* ── AI Badge ── */}
        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700
                        text-xs font-semibold px-4 py-2 rounded-full border
                        border-pink-200 w-fit">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          Powered by Gemini AI · {paths.length} paths generated
        </div>

        {/* ── Path Cards ── */}
        <div className="flex flex-col gap-4">
          {paths.map((path, index) => {
            const isOpen  = expanded === index
            const config  = difficultyConfig[path.difficulty] || difficultyConfig['Intermediate']

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200
                           shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* ── Path Header (always visible) ── */}
                <button
                  onClick={() => setExpanded(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center
                             justify-between gap-4 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">

                    {/* Index */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-pink-100
                                    flex items-center justify-center
                                    text-pink-600 font-extrabold text-sm">
                      {index + 1}
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-gray-900 font-bold text-base">
                          {path.careerGoal}
                        </h2>
                        {/* Difficulty Badge */}
                        <span className={`text-xs font-semibold px-2.5 py-0.5
                                          rounded-full border ${config.color}`}>
                          {path.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">
                          ⏱️ {path.estimatedTime}
                        </span>
                        <span className="text-xs text-gray-400">
                          📋 {path.steps.length} steps
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <span className={`text-gray-400 text-lg transition-transform
                                    duration-300 shrink-0
                                    ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {/* ── Expanded Content ── */}
                {isOpen && (
                  <div className="px-6 pb-6 flex flex-col gap-5 border-t
                                  border-gray-100">

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed pt-4">
                      {path.description}
                    </p>

                    {/* Steps */}
                    <div className="flex flex-col gap-3">
                      {path.steps.map((step, sIndex) => (
                        <div
                          key={sIndex}
                          className="flex gap-4 items-start"
                        >
                          {/* Step line + dot */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center
                                            justify-center text-white font-bold
                                            text-xs ${config.dot} bg-opacity-90`}
                                 style={{ backgroundColor: undefined }}
                                 >
                              <div className={`w-7 h-7 rounded-full flex items-center
                                              justify-center text-white font-bold
                                              text-xs
                                              ${path.difficulty === 'Beginner'
                                                ? 'bg-green-500'
                                                : path.difficulty === 'Advanced'
                                                ? 'bg-red-500'
                                                : 'bg-amber-500'}`}>
                                {step.order}
                              </div>
                            </div>
                            {sIndex < path.steps.length - 1 && (
                              <div className="w-0.5 h-6 bg-gray-200 mt-1" />
                            )}
                          </div>

                          {/* Step content */}
                          <div className="flex-1 pb-1">
                            <div className="flex items-center
                                            justify-between gap-2 flex-wrap">
                              <h3 className="text-gray-900 font-semibold text-sm">
                                {step.topic}
                              </h3>
                              <span className="text-xs text-gray-400 shrink-0">
                                ⏱️ {step.duration}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mt-1">
                              {step.description}
                            </p>
                            <a
                              href={step.resourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1.5
                                         text-xs text-blue-500 hover:text-blue-700
                                         hover:underline font-medium transition-all"
                            >
                              🔗 {step.resourceLabel} →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Bottom Note ── */}
        <p className="text-center text-xs text-gray-300 mt-2">
          Learning paths are tailored to your current skills.
          Update your profile to get more relevant roadmaps.
        </p>

      </div>
    </div>
  )
}

export default LearningPaths
