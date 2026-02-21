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
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex items-center justify-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-12"
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-gray-400 text-base mt-3">
            Sign in to continue to ProfileManager
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-10 py-10">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                            rounded-xl px-4 py-3.5 mb-8 text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl
                           text-base text-gray-900 placeholder-gray-300 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent hover:border-gray-300 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl
                           text-base text-gray-900 placeholder-gray-300 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent hover:border-gray-300 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold
                         text-base hover:bg-blue-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-100 mt-1"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent
                                   rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative flex items-center my-8">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-xs text-gray-400 font-semibold uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google Auth */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent
                              rounded-full animate-spin" />
            </div>
          ) : (
            <GoogleAuthButton />
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-base text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Create one →
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
