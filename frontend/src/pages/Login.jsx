import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import useAuthStore from '../store/authStore'
import axios from 'axios'

const Login = () => {
  const { isLoading, setUser } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        form,
        { withCredentials: true }
      )
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}
         className="flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Sign in to continue</p>

        {/* Email + Password Form */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="Your password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t w-full border-gray-200"></div>
          <span className="px-3 bg-white text-gray-400 text-sm absolute">or</span>
        </div>

        {/* Google Auth */}
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
          <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>

    </div>
  )
}

export default Login
