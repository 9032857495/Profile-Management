import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}
         className="flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in to continue</p>

        {/* Google Sign In Button */}
        <button
          className="w-full flex items-center justify-center gap-3 border border-gray-300
                     rounded-lg px-4 py-3 hover:bg-gray-50 transition font-medium text-gray-700 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

    </div>
  )
}

export default Login
