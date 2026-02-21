import { Link } from 'react-router-dom'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import useAuthStore from '../store/authStore'

const Login = () => {
  const { isLoading } = useAuthStore()

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}
         className="flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in to continue</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent 
                            rounded-full animate-spin"></div>
          </div>
        ) : (
          <GoogleAuthButton />
        )}

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
