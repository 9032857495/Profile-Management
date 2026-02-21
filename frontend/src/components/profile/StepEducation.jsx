import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const DEGREES = ['B.Tech', 'B.E', 'BCA', 'B.Sc', 'MCA', 'M.Tech', 'MBA', 'Other']
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Other']

const StepEducation = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore()

  const [form, setForm] = useState({
    college:        profile?.college        || '',
    degree:         profile?.degree         || '',
    branch:         profile?.branch         || '',
    cgpa:           profile?.cgpa           || '',
    graduationYear: profile?.graduationYear || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleNext = async () => {
    if (!form.college) return setError('College name is required.')
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
        <h2 className="text-xl font-extrabold text-gray-900">Education</h2>
        <p className="text-gray-400 text-sm mt-1">
          Your academic background helps us rank you within your college.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col gap-5">

        {/* College */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            College / University
            <span className="text-xs text-blue-500 font-semibold ml-2">
              🎓 Used for college ranking
            </span>
          </label>
          <input
            type="text"
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="e.g. Raghu Engineering College"
            className="w-full px-5 py-4 border border-gray-200 rounded-xl
                       text-base text-gray-900 placeholder-gray-300 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent hover:border-gray-300 transition"
          />
        </div>

        {/* Degree + Branch — side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Degree */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Degree</label>
            <select
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl
                         text-base text-gray-900 bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent hover:border-gray-300 transition"
            >
              <option value="">Select degree</option>
              {DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl
                         text-base text-gray-900 bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent hover:border-gray-300 transition"
            >
              <option value="">Select branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

        </div>

        {/* CGPA + Graduation Year — side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* CGPA */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">
              CGPA
              <span className="text-gray-400 font-normal ml-1">(out of 10)</span>
            </label>
            <input
              type="number"
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.5"
              min="0"
              max="10"
              step="0.1"
              className="w-full px-5 py-4 border border-gray-200 rounded-xl
                         text-base text-gray-900 placeholder-gray-300 bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent hover:border-gray-300 transition"
            />
          </div>

          {/* Graduation Year */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">
              Graduation Year
            </label>
            <select
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl
                         text-base text-gray-900 bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent hover:border-gray-300 transition"
            >
              <option value="">Select year</option>
              {[2023, 2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="w-1/3 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold
                     text-base hover:bg-gray-200 active:scale-95 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold
                     text-base hover:bg-blue-700 active:scale-95 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg shadow-blue-100"
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

    </div>
  )
}

export default StepEducation
