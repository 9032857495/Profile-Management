import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-100 opacity-40 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-100 opacity-40 blur-3xl rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600
                        text-xs font-semibold px-5 py-2 rounded-full border border-blue-200 mb-10 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Smart Profile Scoring & Ranking Platform
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Build Your Profile.
          <br />
          <span className="text-blue-600">Compete Globally.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Create a professional profile, receive an intelligent score based on your
          achievements, and see how you rank against candidates worldwide.
        </p>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link
              to="/register"
              className="px-10 py-3 rounded-xl text-base font-semibold
                         bg-blue-600 text-white shadow-md
                         hover:bg-blue-700 hover:shadow-lg
                         active:scale-95 transition-all duration-200"
            >
              Get Started Free
            </Link>

            <Link
              to="/login"
              className="px-10 py-3 rounded-xl text-base font-semibold
                         bg-white text-gray-700 border border-gray-300
                         hover:border-blue-400 hover:text-blue-600
                         transition-all duration-200"
            >
              Login →
            </Link>

          </div>
        )}

        {isAuthenticated && (
          <div className="mt-10">
            <Link
  to="/dashboard"
  className="group inline-flex items-center justify-center
             px-16 py-5
             rounded-2xl
             text-lg font-semibold
             bg-gradient-to-r from-blue-600 to-indigo-600
             text-white
             shadow-xl shadow-blue-200/60
             hover:shadow-2xl hover:shadow-blue-300/70
             hover:-translate-y-1
             active:scale-95
             transition-all duration-300"
>
  Go to Dashboard
  <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default Home