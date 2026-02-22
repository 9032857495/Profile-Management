import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { changePassword } from '../services/authService'

const AccountSettings = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('All fields are required.')
    }

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.')
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long.')
    }

    try {
      setLoading(true)
      const data = await changePassword({ currentPassword, newPassword })
      if (data.success) {
        setSuccess('Password updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.message || 'Failed to update password.')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const isGoogleUser = user?.authProvider === 'google' || (!user?.password && user?.authProvider === 'local')

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-md flex flex-col gap-6 bg-white border border-gray-200
                      rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Manage your account security.
            </p>
          </div>
        </div>

        {isGoogleUser && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl p-3">
            This account uses Google Sign-In. Password change is not available.
          </div>
        )}

        {!isGoogleUser && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200
                             rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-200
                             rounded-xl px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5
                         rounded-xl hover:bg-blue-700 active:scale-95 transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs text-gray-400 hover:text-blue-600 hover:underline self-center mt-1"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default AccountSettings
