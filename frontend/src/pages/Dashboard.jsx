import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-5xl flex flex-col gap-6">

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
            <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-blue-300
                            flex items-center justify-center text-white font-bold
                            text-2xl shrink-0 self-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name + Email */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {user?.name}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* ── Profile Completion ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6
                        flex flex-col gap-4">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-gray-900 font-bold text-base">Profile Completion</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Complete your profile to improve your ranking score.
              </p>
            </div>
            <span className="text-blue-600 font-extrabold text-2xl shrink-0">20%</span>
          </div>

          {/* Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: '20%' }}
            />
          </div>

          {/* Step Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Account', done: true },
              { label: 'Personal Info', done: false },
              { label: 'Education', done: false },
              { label: 'Skills', done: false },
              { label: 'Experience', done: false },
            ].map((step) => (
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
        </div>

        {/* ── Quick Actions ── */}
        <h2 className="text-gray-900 font-bold text-lg">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '👤',
              title: 'Build Your Profile',
              desc: 'Add education, skills, and experience.',
              label: 'Start Now →',
              iconBg: 'bg-blue-100',
              cardBg: 'bg-white hover:bg-blue-50',
              border: 'border-blue-200 hover:border-blue-400',
              disabled: false,
              action: () => navigate('/profile-builder'),
            },
            {
              icon: '📄',
              title: 'Upload Resume',
              desc: 'Let the system extract and evaluate your resume.',
              label: 'Coming Soon',
              iconBg: 'bg-yellow-100',
              cardBg: 'bg-white',
              border: 'border-gray-200',
              disabled: true,
            },
            {
              icon: '📊',
              title: 'View Rankings',
              desc: 'See how you rank against other candidates.',
              label: 'Coming Soon',
              iconBg: 'bg-purple-100',
              cardBg: 'bg-white',
              border: 'border-gray-200',
              disabled: true,
            },
            {
              icon: '🎯',
              title: 'Job Recommendations',
              desc: 'Browse jobs matched to your skill profile.',
              label: 'Coming Soon',
              iconBg: 'bg-green-100',
              cardBg: 'bg-white',
              border: 'border-gray-200',
              disabled: true,
            },
            {
              icon: '🛤️',
              title: 'Learning Paths',
              desc: 'Curated roadmaps to bridge your skill gaps.',
              label: 'Coming Soon',
              iconBg: 'bg-pink-100',
              cardBg: 'bg-white',
              border: 'border-gray-200',
              disabled: true,
            },
            {
              icon: '⚙️',
              title: 'Account Settings',
              desc: 'Manage your password and preferences.',
              label: 'Coming Soon',
              iconBg: 'bg-slate-100',
              cardBg: 'bg-white',
              border: 'border-gray-200',
              disabled: true,
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={!card.disabled ? card.action : undefined}
              className={`group ${card.cardBg} rounded-2xl p-5 border ${card.border}
                          transition-all duration-300 flex flex-col gap-3
                          ${card.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
                          }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl
                               text-2xl ${card.iconBg} transition-transform duration-300
                               ${!card.disabled ? 'group-hover:scale-110' : ''}`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">{card.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-1">{card.desc}</p>
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
