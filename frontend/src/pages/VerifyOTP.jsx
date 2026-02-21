import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        { email, otp },
        { withCredentials: true }
      )
      navigate('/dashboard')
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
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center
                          justify-center text-3xl mx-auto mb-5">
            📧
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Check your email
          </h2>
          <p className="text-gray-400 text-base mt-3">
            We sent a 6-digit OTP to
          </p>
          <p className="text-blue-600 font-bold text-base mt-1">
            {email}
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Enter OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full px-5 py-4 border border-gray-200 rounded-xl
                           text-2xl font-bold text-center text-gray-900
                           tracking-[0.6em] placeholder-gray-200 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent hover:border-gray-300 transition"
              />
              <p className="text-xs text-gray-400 text-center">
                OTP expires in 10 minutes
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold
                         text-base hover:bg-blue-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent
                                   rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify & Create Account →'
              )}
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-base text-gray-400 mt-8">
          Wrong email?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 font-bold cursor-pointer hover:underline"
          >
            Go back →
          </span>
        </p>

      </div>
    </div>
  )
}
