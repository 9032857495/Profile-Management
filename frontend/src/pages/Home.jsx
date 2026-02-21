import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="relative flex flex-col items-center justify-center
                 bg-gradient-to-br from-slate-50 via-white to-blue-50
                 px-6 py-20 overflow-hidden"
    >

      {/* ── Background blobs ── */}
      <div className="absolute top-0 left-0 w-full h-full
                      pointer-events-none overflow-hidden -z-10">

        {/* Top-left blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full
                        bg-blue-100 opacity-50 blur-3xl" />

        {/* Bottom-right blob */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full
                        bg-indigo-100 opacity-50 blur-3xl" />

        {/* Center faint blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2
                        -translate-y-1/2 w-[600px] h-[600px] rounded-full
                        bg-blue-50 opacity-60 blur-3xl" />
      </div>

      {/* ── Floating emoji decorations ── */}
      <div className="absolute top-16 left-10 text-4xl opacity-20
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '3s' }}>🎓</div>
      <div className="absolute top-24 right-16 text-3xl opacity-20
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '4s' }}>💻</div>
      <div className="absolute bottom-24 left-16 text-3xl opacity-20
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '5s' }}>📊</div>
      <div className="absolute bottom-16 right-10 text-4xl opacity-20
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '3.5s' }}>🏆</div>
      <div className="absolute top-1/2 left-6 text-2xl opacity-15
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '4.5s' }}>🧠</div>
      <div className="absolute top-1/2 right-6 text-2xl opacity-15
                      select-none hidden lg:block animate-bounce"
           style={{ animationDuration: '3.8s' }}>🎯</div>

      {/* ── Badge ── */}
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600
                      text-xs font-semibold px-4 py-1.5 rounded-full border
                      border-blue-200 mb-8 tracking-wide uppercase">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        Candidate Profile Analysis & Ranking
      </div>

      {/* ── Heading ── */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold
                     text-gray-900 text-center leading-tight mb-6 max-w-3xl">
        Analyze. Rank.{' '}
        <span className="text-blue-600 relative">
          Grow.
          <span className="absolute -bottom-1 left-0 w-full h-1
                           bg-blue-200 rounded-full" />
        </span>
      </h1>

      {/* ── Subheading ── */}
      <p className="text-gray-500 text-base sm:text-lg text-center max-w-xl
                    leading-relaxed mb-10">
        Build your professional profile, get ranked against global candidates,
        and receive personalized career recommendations tailored to you.
      </p>

      {/* ── CTA — not logged in ── */}
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3
                       rounded-xl text-sm sm:text-base font-semibold
                       hover:bg-blue-700 active:scale-95 transition-all
                       shadow-lg shadow-blue-200 text-center"
          >
            Get Started — it's free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3
                       rounded-xl text-sm sm:text-base font-semibold
                       border border-gray-200 hover:border-blue-400
                       hover:text-blue-600 transition-all text-center"
          >
            Login →
          </Link>
        </div>
      )}

      {/* ── Already logged in nudge ── */}
      {isAuthenticated && (
        <p className="text-sm text-gray-400">
          You're logged in.{' '}
          <Link
            to="/dashboard"
            className="text-blue-500 hover:underline font-medium"
          >
            View your Dashboard →
          </Link>
        </p>
      )}

    </div>
  )
}

export default Home
