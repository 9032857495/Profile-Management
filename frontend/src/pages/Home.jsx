import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}
         className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Profile Management
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Analyze. Rank. Grow your career.
      </p>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </div>
  )
}

export default Home
