import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useProfileStore from '../store/profileStore'
import { getMyProfile } from '../services/profileService'
import ScoreCard from '../components/dashboard/ScoreCard'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { profile, setProfile }   = useProfileStore()
  const navigate                  = useNavigate()
  const [loading, setLoading]     = useState(true)

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  // ── Fetch profile on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyProfile()
        if (data.success) setProfile(data.profile)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [setProfile])

  const percent = profile?.completionPercent || 0

  const steps = [
    { label: 'Personal Info',  done: !!(profile?.phone || profile?.city)  },
    { label: 'Education',      done: !!(profile?.college && profile?.cgpa) },
    { label: 'Skills',         done: profile?.skills?.length > 0           },
    { label: 'Certifications', done: profile?.certifications?.length > 0   },
    { label: 'Projects',       done: profile?.projects?.length > 0         },
    { label: 'Internships',    done: profile?.internships?.length > 0      },
  ]

  // ── Loading ──
  if (loading) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex items-center justify-center
                   bg-gradient-to-br from-slate-50 via-white to-blue-50"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent
                          rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* ── Incomplete Banner ── */}
        {percent < 100 && (
          <div className="flex items-center justify-between gap-4
                          bg-amber-50 border border-amber-200
                          rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Your profile is {percent}% complete
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Complete your profile to appear in rankings and get noticed.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/build')}
              className="shrink-0 bg-amber-400 hover:bg-amber-500 text-white
                         text-sm font-bold px-4 py-2 rounded-xl
                         active:scale-95 transition-all"
            >
              Complete →
            </button>
          </div>
        )}

        {/* ── Welcome Banner ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6
                        flex flex-col sm:flex-row sm:items-center gap-5">

          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-4 border-blue-500
                         object-cover shrink-0 self-center"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 border-4
                            border-blue-300 flex items-center justify-center
                            text-white font-bold text-2xl shrink-0 self-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name + Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-blue-500 font-bold uppercase
                          tracking-widest mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900
                           leading-tight">
              {user?.name}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {profile?.college
                ? `${profile.college}${profile.branch ? ' · ' + profile.branch : ''}`
                : user?.email}
            </p>
            {profile?.city && (
              <p className="text-gray-300 text-xs mt-0.5">
                📍 {profile.city}{profile.state ? `, ${profile.state}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* ── Profile Completion ── */}
        <div className="bg-white rounded-2xl border border-gray-200
                        shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-start sm:items-center
                          justify-between gap-4">
            <div>
              <h2 className="text-gray-900 font-bold text-base">
                Profile Completion
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Complete your profile to improve your ranking score.
              </p>
            </div>
            <span className={`font-extrabold text-2xl shrink-0
              ${percent === 100 ? 'text-green-500' : 'text-blue-600'}`}>
              {percent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-700
                ${percent === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Step Pills */}
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <span
                key={step.label}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border
                  ${step.done
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
              >
                {step.done ? '✅' : '⬜'} {step.label}
              </span>
            ))}
          </div>

          {/* Skills preview */}
          {profile?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-600 border border-blue-200
                             text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 8 && (
                <span className="text-xs text-gray-400 font-medium self-center">
                  +{profile.skills.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Score Card ── */}
        <ScoreCard profile={profile} />

        {/* ── Quick Actions ── */}
        <h2 className="text-gray-900 font-bold text-lg">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon:     '👤',
              title:    'Build Your Profile',
              desc:     'Add education, skills, and experience.',
              label:    percent === 100 ? 'Edit Profile →' : 'Start Now →',
              iconBg:   'bg-blue-100',
              cardBg:   'bg-white hover:bg-blue-50',
              border:   'border-blue-200 hover:border-blue-400',
              disabled: false,
              action:   () => navigate('/profile/build'),
            },
            {
  icon:     '📊',
  title:    'View Rankings',
  desc:     'See how you rank against other candidates.',
  label:    'View Now →',            // ← changed
  iconBg:   'bg-purple-100',
  cardBg:   'bg-white hover:bg-purple-50',  // ← changed
  border:   'border-purple-200 hover:border-purple-400',  // ← changed
  disabled: false,                   // ← changed
  action:   () => navigate('/rankings'),  // ← added
},
            {
  icon:     '🎯',
  title:    'Job Recommendations',
  desc:     'Browse AI-matched jobs based on your skill profile.',
  label:    'View Jobs →',           // ← changed
  iconBg:   'bg-green-100',
  cardBg:   'bg-white hover:bg-green-50',   // ← changed
  border:   'border-green-200 hover:border-green-400', // ← changed
  disabled: false,                   // ← changed
  action:   () => navigate('/jobs'), // ← added
},

            {
  icon:     '🛤️',
  title:    'Learning Paths',
  desc:     'AI-generated roadmaps to bridge your skill gaps.',
  label:    'View Paths →',                    // ← changed
  iconBg:   'bg-pink-100',
  cardBg:   'bg-white hover:bg-pink-50',       // ← changed
  border:   'border-pink-200 hover:border-pink-400', // ← changed
  disabled: false,                             // ← changed
  action:   () => navigate('/learning-paths'), // ← added
},

            // {
            //   icon:     '🏆',
            //   title:    'College Rankings',
            //   desc:     'See top students from your college.',
            //   label:    'Coming Soon',
            //   iconBg:   'bg-yellow-100',
            //   cardBg:   'bg-white',
            //   border:   'border-gray-200',
            //   disabled: true,
            // },
            // {
            //   icon:     '⚙️',
            //   title:    'Account Settings',
            //   desc:     'Manage your password and preferences.',
            //   label:    'Coming Soon',
            //   iconBg:   'bg-slate-100',
            //   cardBg:   'bg-white',
            //   border:   'border-gray-200',
            //   disabled: true,
            // },
          ].map((card) => (
            <div
              key={card.title}
              onClick={!card.disabled ? card.action : undefined}
              className={`group ${card.cardBg} rounded-2xl p-5 border
                          ${card.border} transition-all duration-300
                          flex flex-col gap-3
                          ${card.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
                          }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center
                               rounded-xl text-2xl ${card.iconBg}
                               transition-transform duration-300
                               ${!card.disabled ? 'group-hover:scale-110' : ''}`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-1">
                  {card.desc}
                </p>
              </div>
              <span className={`text-xs font-bold mt-auto
                ${card.disabled ? 'text-gray-300' : 'text-blue-600'}`}>
                {card.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
