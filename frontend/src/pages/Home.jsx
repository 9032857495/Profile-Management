import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}
         className="flex flex-col items-center justify-center bg-gray-50 px-4">

      {/* Badge */}
      <span className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1 rounded-full mb-6">
        🚀 Candidate Profile Analysis & Ranking System
      </span>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
        Analyze. Rank. <span className="text-blue-600">Grow.</span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-500 text-lg mb-10 text-center max-w-xl">
        Build your profile, get ranked against global candidates,
        and receive personalized career recommendations.
      </p>

      {/* CTA Button */}
      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg 
                     font-medium hover:bg-blue-700 transition"
        >
          Go to Dashboard →
        </Link>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg 
                     font-medium hover:bg-blue-700 transition"
        >
          Get Started →
        </Link>
      )}

      {/* Stats Row */}
      <div className="flex gap-12 mt-16">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">500+</p>
          <p className="text-gray-500 text-sm">Candidates</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">50+</p>
          <p className="text-gray-500 text-sm">Job Matches</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">100+</p>
          <p className="text-gray-500 text-sm">Learning Paths</p>
        </div>
      </div>

    </div>
  )
}

export default Home
