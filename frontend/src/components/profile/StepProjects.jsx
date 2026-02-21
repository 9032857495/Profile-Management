import { useState } from 'react'
import useProfileStore from '../../store/profileStore'
import { updateMyProfile } from '../../services/profileService'

const EMPTY_PROJECT = { title: '', description: '', techStack: [], link: '' }

const StepProjects = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore()

  const [projects, setProjects] = useState(
    profile?.projects?.length > 0 ? profile.projects : [{ ...EMPTY_PROJECT }]
  )
  const [techInputs, setTechInputs] = useState(
    projects.map((p) => p.techStack?.join(', ') || '')
  )
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Update a single project field ──
  const handleChange = (index, field, value) => {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    setProjects(updated)
  }

  // ── Handle techStack input (comma separated) ──
  const handleTechInput = (index, value) => {
    const updated = [...techInputs]
    updated[index] = value
    setTechInputs(updated)

    // Parse into array on the fly
    const techs = value.split(',').map((t) => t.trim()).filter(Boolean)
    handleChange(index, 'techStack', techs)
  }

  // ── Add new project row ──
  const addProject = () => {
    if (projects.length >= 8) return
    setProjects([...projects, { ...EMPTY_PROJECT }])
    setTechInputs([...techInputs, ''])
  }

  // ── Remove a project row ──
  const removeProject = (index) => {
    if (projects.length === 1) {
      setProjects([{ ...EMPTY_PROJECT }])
      setTechInputs([''])
      return
    }
    setProjects(projects.filter((_, i) => i !== index))
    setTechInputs(techInputs.filter((_, i) => i !== index))
  }

  // ── Save & Next ──
  const handleNext = async () => {
    const filled = projects.filter((p) => p.title.trim() !== '')
    setLoading(true)
    setError('')
    try {
      const data = await updateMyProfile({ projects: filled })
      if (data.success) {
        updateProfile({ projects: filled })
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
        <h2 className="text-xl font-extrabold text-gray-900">Projects</h2>
        <p className="text-gray-400 text-sm mt-1">
          Showcase your best work. This step is optional but boosts your profile score.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm
                        rounded-xl px-4 py-3 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Project Cards */}
      <div className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border border-gray-200 rounded-2xl
                       p-4 bg-gray-50 relative"
          >
            {/* Remove button */}
            <button
              onClick={() => removeProject(index)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400
                         transition text-xl font-bold leading-none"
            >
              ×
            </button>

            {/* Project number */}
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">
              Project {index + 1}
            </p>

            {/* Title */}
            <input
              type="text"
              placeholder="Project title *"
              value={project.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder-gray-300 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition"
            />

            {/* Description */}
            <textarea
              placeholder="Brief description of what you built..."
              value={project.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder-gray-300 bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition resize-none"
            />

            {/* Tech Stack */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Tech stack — e.g. React, Node.js, MongoDB"
                value={techInputs[index]}
                onChange={(e) => handleTechInput(index, e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
              />
              {/* Tech pill preview */}
              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-600 border border-blue-200
                                 text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Link */}
            <input
              type="url"
              placeholder="Project link — GitHub / Live URL (optional)"
              value={project.link}
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
      {projects.length < 8 && (
        <button
          onClick={addProject}
          className="w-full py-3 border-2 border-dashed border-gray-200
                     rounded-2xl text-sm font-bold text-gray-400
                     hover:border-blue-300 hover:text-blue-500
                     active:scale-95 transition-all"
        >
          + Add Another Project
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

export default StepProjects
