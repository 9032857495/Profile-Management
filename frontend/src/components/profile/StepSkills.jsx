import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const POPULAR_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java',
  'C++', 'MongoDB', 'SQL', 'Git', 'HTML/CSS',
  'TypeScript', 'Express', 'Tailwind CSS', 'Firebase', 'AWS',
]

const StepSkills = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore()

  const [skills, setSkills]   = useState(profile?.skills || [])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Add skill ──
  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    if (skills.includes(trimmed)) return        // no duplicates
    if (skills.length >= 20) return             // max 20 skills
    setSkills([...skills, trimmed])
    setInput('')
  }

  // ── Handle input keydown ──
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(input)
    }
    if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      setSkills(skills.slice(0, -1))            // remove last on backspace
    }
  }

  // ── Remove skill ──
  const removeSkill = (skill) =>
    setSkills(skills.filter((s) => s !== skill))

  // ── Save & Next ──
  const handleNext = async () => {
    if (skills.length === 0) return setError('Add at least one skill.')
    setLoading(true)
    setError('')
    try {
      const data = await updateMyProfile({ skills })
      if (data.success) {
        updateProfile({ skills })
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
        <h2 className="text-xl font-extrabold text-gray-900">Skills</h2>
        <p className="text-gray-400 text-sm mt-1">
          Add your technical skills. Press <kbd className="bg-gray-100 px-1.5 py-0.5
          rounded text-xs font-mono text-gray-600">Enter</kbd> or{' '}
          <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono
          text-gray-600">,</kbd> to add.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Tag Input Box */}
      <div
        className="flex flex-wrap gap-2 w-full min-h-[56px] px-4 py-3
                   border border-gray-200 rounded-xl bg-gray-50
                   focus-within:ring-2 focus-within:ring-blue-500
                   focus-within:border-transparent hover:border-gray-300
                   transition cursor-text"
        onClick={() => document.getElementById('skill-input').focus()}
      >
        {/* Skill Tags */}
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-700
                       border border-blue-200 px-3 py-1 rounded-full text-sm
                       font-semibold"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-blue-400 hover:text-blue-700 transition
                         leading-none text-base font-bold"
            >
              ×
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          id="skill-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addSkill(input)}
          placeholder={skills.length === 0 ? 'e.g. React, Python, SQL...' : ''}
          className="flex-1 min-w-[140px] bg-transparent outline-none
                     text-sm text-gray-800 placeholder-gray-300 py-1"
        />
      </div>

      {/* Counter */}
      <p className="text-xs text-gray-400 -mt-4 text-right">
        {skills.length}/20 skills
      </p>

      {/* Popular Skills */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-600">⚡ Popular Skills</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="px-3 py-1.5 rounded-full border border-gray-200
                         text-sm text-gray-600 bg-white hover:bg-blue-50
                         hover:border-blue-300 hover:text-blue-600
                         active:scale-95 transition-all font-medium"
            >
              + {skill}
            </button>
          ))}
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

export default StepSkills
