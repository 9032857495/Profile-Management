import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center justify-center bg-gradient-to-br 
                 from-slate-50 via-white to-blue-50 px-6 py-20"
    >

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs 
                      font-semibold px-4 py-1.5 rounded-full border border-blue-200 
                      mb-8 tracking-wide uppercase">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Candidate Profile Analysis & Ranking
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 
                     text-center leading-tight mb-6 max-w-3xl">
        Analyze. Rank.{' '}
        <span className="text-blue-600 relative">
          Grow.
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-200 rounded-full" />
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-500 text-base sm:text-lg text-center max-w-xl 
                    leading-relaxed mb-10">
        Build your professional profile, get ranked against global candidates,
        and receive personalized career recommendations tailored to you.
      </p>

      {/* CTA Buttons — only when NOT logged in */}
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-20">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl 
                       text-sm sm:text-base font-semibold hover:bg-blue-700 
                       active:scale-95 transition-all shadow-lg shadow-blue-200 text-center"
          >
            Get Started — it's free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3 rounded-xl 
                       text-sm sm:text-base font-semibold border border-gray-200 
                       hover:border-blue-400 hover:text-blue-600 transition-all text-center"
          >
            Login →
          </Link>
        </div>
      )}

      {/* Already logged in — soft nudge */}
      {isAuthenticated && (
        <p className="text-sm text-gray-400 mb-20">
          You're logged in.{' '}
          <Link to="/dashboard" className="text-blue-500 hover:underline font-medium">
            View your Dashboard
          </Link>
        </p>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 
                      w-full max-w-5xl">
        {[
          {
            icon: '🧠',
            title: 'Smart Scoring',
            desc: 'AI-powered skill scoring based on your profile, experience, and projects.',
            iconBg: 'bg-blue-100',
            border: 'border-blue-100 hover:border-blue-300',
            bg: 'hover:bg-blue-50',
          },
          {
            icon: '📊',
            title: 'Candidate Ranking',
            desc: 'See where you stand among thousands of candidates globally in real time.',
            iconBg: 'bg-purple-100',
            border: 'border-purple-100 hover:border-purple-300',
            bg: 'hover:bg-purple-50',
          },
          {
            icon: '🎯',
            title: 'Job Recommendations',
            desc: 'Receive job matches that are precisely tailored to your skills and goals.',
            iconBg: 'bg-green-100',
            border: 'border-green-100 hover:border-green-300',
            bg: 'hover:bg-green-50',
          },
          {
            icon: '📄',
            title: 'Resume Upload',
            desc: 'Upload your resume and let the system extract and evaluate your details.',
            iconBg: 'bg-yellow-100',
            border: 'border-yellow-100 hover:border-yellow-300',
            bg: 'hover:bg-yellow-50',
          },
          {
            icon: '🛤️',
            title: 'Learning Paths',
            desc: 'Get curated learning roadmaps to bridge your skill gaps and level up.',
            iconBg: 'bg-pink-100',
            border: 'border-pink-100 hover:border-pink-300',
            bg: 'hover:bg-pink-50',
          },
          {
            icon: '🔐',
            title: 'Secure & Private',
            desc: 'Your data is encrypted and protected with enterprise-grade security.',
            iconBg: 'bg-slate-100',
            border: 'border-slate-100 hover:border-slate-300',
            bg: 'hover:bg-slate-50',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`group bg-white rounded-2xl p-6 border ${card.border} ${card.bg}
                        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                        flex flex-col gap-3 cursor-default`}
          >
            {/* Icon Box */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl 
                             text-2xl ${card.iconBg} transition-transform 
                             duration-300 group-hover:scale-110`}>
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-gray-900 font-semibold text-base">{card.title}</h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home
