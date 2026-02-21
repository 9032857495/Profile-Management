import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../store/profileStore'
import { getMyProfile } from '../services/profileService'

const ProfileComplete = () => {
  const { profile, setProfile } = useProfileStore()
  const navigate                = useNavigate()

  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(true)

  // ── Fetch fresh profile from backend on mount ──
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile()
        if (data.success) setProfile(data.profile)
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [setProfile])

  // ── Entrance animation ──
  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  const percent = profile?.completionPercent || 0

  const steps = [
    { label: 'Personal Info',  done: !!(profile?.phone || profile?.city),      points: 20 },
    { label: 'Education',      done: !!(profile?.college && profile?.cgpa),     points: 20 },
    { label: 'Skills',         done: profile?.skills?.length > 0,              points: 20 },
    { label: 'Certifications', done: profile?.certifications?.length > 0,      points: 10 },
    { label: 'Projects',       done: profile?.projects?.length > 0,            points: 20 },
    { label: 'Internships',    done: profile?.internships?.length > 0,         points: 10 },
  ]

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent
                          rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50
                    flex items-center justify-center px-4 py-12">
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-100
                    border border-gray-100 p-8 flex flex-col gap-7
                    transition-all duration-700
                    ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >

        {/* 🎉 Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Profile {percent === 100 ? 'Complete!' : 'Saved!'}
          </h1>
          <p className="text-gray-400 text-sm">
            {percent === 100
              ? "You're all set! Your profile is 100% complete."
              : `Your profile is ${percent}% complete. Fill remaining steps to boost your rank.`}
          </p>
        </div>

        {/* ── Completion Ring ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="50"
                fill="none" stroke="#f1f5f9" strokeWidth="10"
              />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={percent === 100 ? '#22c55e' : '#3b82f6'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - percent / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold
                ${percent === 100 ? 'text-green-500' : 'text-blue-600'}`}>
                {percent}%
              </span>
              <span className="text-xs text-gray-400 font-medium">complete</span>
            </div>
          </div>
        </div>

        {/* ── Step Checklist ── */}
        <div className="flex flex-col gap-2">
          {steps.map((step) => (
            <div
              key={step.label}
              className={`flex items-center justify-between px-4 py-3
                          rounded-xl border transition
                          ${step.done
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg
                  ${step.done ? 'text-green-500' : 'text-gray-300'}`}>
                  {step.done ? '✅' : '○'}
                </span>
                <span className={`text-sm font-semibold
                  ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full
                ${step.done
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'}`}>
                +{step.points}%
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold
                       text-base hover:bg-blue-700 active:scale-95 transition-all
                       shadow-lg shadow-blue-100"
          >
            Go to Dashboard →
          </button>

          {percent < 100 && (
            <button
              onClick={() => navigate('/profile/build')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold
                         text-base hover:bg-gray-200 active:scale-95 transition-all"
            >
              Complete Remaining Steps
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfileComplete
