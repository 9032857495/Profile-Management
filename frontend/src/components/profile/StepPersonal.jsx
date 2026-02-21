import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const StepPersonal = ({ onNext }) => {
  const { profile, updateProfile } = useProfileStore()

  const [form, setForm] = useState({
    phone: profile?.phone || '',
    city:  profile?.city  || '',
    state: profile?.state || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleNext = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await updateMyProfile(form)
      if (data.success) {
        updateProfile(form)
        onNext()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Personal Info</h2>
        <p className="text-gray-400 text-sm mt-1">
          This helps us rank you locally and globally.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Fields */}
      <div className="flex flex-col gap-5">

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            Phone Number
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full px-5 py-4 border border-gray-200 rounded-xl
                       text-base text-gray-900 placeholder-gray-300 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent hover:border-gray-300 transition"
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            City
            <span className="text-xs text-blue-500 font-semibold ml-2">
              📍 Used for local ranking
            </span>
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Hyderabad"
            className="w-full px-5 py-4 border border-gray-200 rounded-xl
                       text-base text-gray-900 placeholder-gray-300 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent hover:border-gray-300 transition"
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            State
          </label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="e.g. Telangana"
            className="w-full px-5 py-4 border border-gray-200 rounded-xl
                       text-base text-gray-900 placeholder-gray-300 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent hover:border-gray-300 transition"
          />
        </div>

      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold
                   text-base hover:bg-blue-700 active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-blue-100 mt-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent
                             rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          'Save & Continue →'
        )}
      </button>

    </div>
  )
}

export default StepPersonal
