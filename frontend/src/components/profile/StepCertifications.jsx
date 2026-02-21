import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const EMPTY_CERT = { title: '', issuer: '', year: '', link: '' }

const StepCertifications = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore()

  const [certs, setCerts]     = useState(
    profile?.certifications?.length > 0 ? profile.certifications : [{ ...EMPTY_CERT }]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Update a single cert field ──
  const handleChange = (index, field, value) => {
    const updated = [...certs]
    updated[index] = { ...updated[index], [field]: value }
    setCerts(updated)
  }

  // ── Add new cert row ──
  const addCert = () => {
    if (certs.length >= 10) return
    setCerts([...certs, { ...EMPTY_CERT }])
  }

  // ── Remove a cert row ──
  const removeCert = (index) => {
    if (certs.length === 1) return setCerts([{ ...EMPTY_CERT }]) // keep 1 empty
    setCerts(certs.filter((_, i) => i !== index))
  }

  // ── Save & Next ──
  const handleNext = async () => {
    // Filter out completely empty rows before saving
    const filled = certs.filter((c) => c.title.trim() !== '')
    setLoading(true)
    setError('')
    try {
      const data = await updateMyProfile({ certifications: filled })
      if (data.success) {
        updateProfile({ certifications: filled })
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
        <h2 className="text-xl font-extrabold text-gray-900">Certifications</h2>
        <p className="text-gray-400 text-sm mt-1">
          Add courses or certifications you've completed. This step is optional.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Cert Cards */}
      <div className="flex flex-col gap-4">
        {certs.map((cert, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border border-gray-200 rounded-2xl
                       p-4 bg-gray-50 relative"
          >
            {/* Remove button */}
            <button
              onClick={() => removeCert(index)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400
                         transition text-xl font-bold leading-none"
            >
              ×
            </button>

            {/* Cert number */}
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">
              Certification {index + 1}
            </p>

            {/* Title */}
            <input
              type="text"
              placeholder="Certificate title *"
              value={cert.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder-gray-300 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition"
            />

            {/* Issuer + Year — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Issuer (e.g. Coursera)"
                value={cert.issuer}
                onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
              />
              <select
                value={cert.year}
                onChange={(e) => handleChange(index, 'year', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl
                           text-sm text-gray-900 bg-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
              >
                <option value="">Year</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Link */}
            <input
              type="url"
              placeholder="Certificate link (optional)"
              value={cert.link}
              onChange={(e) => handleChange(index, 'link', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder-gray-300 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition"
            />
          </div>
        ))}
      </div>

      {/* Add more */}
      {certs.length < 10 && (
        <button
          onClick={addCert}
          className="w-full py-3 border-2 border-dashed border-gray-200
                     rounded-2xl text-sm font-bold text-gray-400
                     hover:border-blue-300 hover:text-blue-500
                     active:scale-95 transition-all"
        >
          + Add Another Certification
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

export default StepCertifications
