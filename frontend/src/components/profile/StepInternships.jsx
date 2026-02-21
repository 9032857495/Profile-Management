import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const EMPTY_INTERNSHIP = { company: '', role: '', duration: '', description: '' }

const DURATIONS = [
  '1 Month', '2 Months', '3 Months', '4 Months',
  '6 Months', '12 Months', 'Ongoing',
]

const StepInternships = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore()

  const [internships, setInternships] = useState(
    profile?.internships?.length > 0
      ? profile.internships
      : [{ ...EMPTY_INTERNSHIP }]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Update a single internship field ──
  const handleChange = (index, field, value) => {
    const updated = [...internships]
    updated[index] = { ...updated[index], [field]: value }
    setInternships(updated)
  }

  // ── Add new row ──
  const addInternship = () => {
    if (internships.length >= 6) return
    setInternships([...internships, { ...EMPTY_INTERNSHIP }])
  }

  // ── Remove a row ──
  const removeInternship = (index) => {
    if (internships.length === 1) {
      setInternships([{ ...EMPTY_INTERNSHIP }])
      return
    }
    setInternships(internships.filter((_, i) => i !== index))
  }

  // ── Save & Finish ──
  const handleNext = async () => {
    const filled = internships.filter((i) => i.company.trim() !== '')
    setLoading(true)
    setError('')
    try {
      const data = await updateMyProfile({ internships: filled })
      if (data.success) {
        updateProfile({ internships: filled })
        onNext()  // ← goes to completion screen
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
        <h2 className="text-xl font-extrabold text-gray-900">Internships</h2>
        <p className="text-gray-400 text-sm mt-1">
          Add any internships or work experience. This step is optional.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Internship Cards */}
      <div className="flex flex-col gap-4">
        {internships.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border border-gray-200 rounded-2xl
                       p-4 bg-gray-50 relative"
          >
            {/* Remove button */}
            <button
              onClick={() => removeInternship(index)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400
                         transition text-xl font-bold leading-none"
            >
              ×
            </button>

            {/* Internship number */}
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">
              Internship {index + 1}
            </p>

            {/* Company + Role — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company name *"
                value={item.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
              />
              <input
                type="text"
                placeholder="Role (e.g. Frontend Intern)"
                value={item.role}
                onChange={(e) => handleChange(index, 'role', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
              />
            </div>

            {/* Duration dropdown */}
            <select
              value={item.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition"
            >
              <option value="">Select duration</option>
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Description */}
            <textarea
              placeholder="What did you work on? (optional)"
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder-gray-300 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition resize-none"
            />
          </div>
        ))}
      </div>

      {/* Add more */}
      {internships.length < 6 && (
        <button
          onClick={addInternship}
          className="w-full py-3 border-2 border-dashed border-gray-200
                     rounded-2xl text-sm font-bold text-gray-400
                     hover:border-blue-300 hover:text-blue-500
                     active:scale-95 transition-all"
        >
          + Add Another Internship
        </button>
      )}

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
          className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold
                     text-base hover:bg-green-600 active:scale-95 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg shadow-green-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent
                               rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            '🎉 Finish & View Profile →'
          )}
        </button>
      </div>

    </div>
  )
}

export default StepInternships
