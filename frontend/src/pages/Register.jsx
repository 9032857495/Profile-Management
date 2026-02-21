import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        form,
        { withCredentials: true }
      )
      navigate('/verify-otp', { state: { email: form.email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
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
            Create account
          </h2>
          <p className="text-gray-400 text-base mt-3">
            Join ProfileManager and build your profile today
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

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl
                           text-base text-gray-900 placeholder-gray-300 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent hover:border-gray-300 transition"
              />
            </div>

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
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl
                           text-base text-gray-900 placeholder-gray-300 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent hover:border-gray-300 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold
                         text-base hover:bg-blue-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-100 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent
                                   rounded-full animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                'Send OTP →'
              )}
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-base text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in →
          </Link>
        </p>

      </div>
    </div>
  )
}
