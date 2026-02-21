import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileStore from '../store/profileStore'
import useAuthStore from '../store/authStore'
import { getMyProfile } from '../services/profileService'

import StepPersonal       from '../components/profile/StepPersonal'
import StepEducation      from '../components/profile/StepEducation'
import StepSkills         from '../components/profile/StepSkills'
import StepCertifications from '../components/profile/StepCertifications'
import StepProjects       from '../components/profile/StepProjects'
import StepInternships    from '../components/profile/StepInternships'

const STEPS = [
  { id: 1, label: 'Personal',       icon: '👤' },
  { id: 2, label: 'Education',      icon: '🎓' },
  { id: 3, label: 'Skills',         icon: '🧠' },
  { id: 4, label: 'Certifications', icon: '📜' },
  { id: 5, label: 'Projects',       icon: '💻' },
  { id: 6, label: 'Internships',    icon: '🏢' },
]

const ProfileBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const { setProfile, setProfileLoading, isProfileLoading } = useProfileStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  // ── Load existing profile on mount ──
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true)
      try {
        const data = await getMyProfile()
        if (data.success) setProfile(data.profile)
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [setProfile, setProfileLoading])

  // ── Navigation ──
  const goNext = () => {
    if (currentStep === STEPS.length) {
      navigate('/profile/complete')   // ← last step → complete screen
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  // ── Render current step ──
  const renderStep = () => {
    const props = { onNext: goNext, onBack: goBack }
    switch (currentStep) {
      case 1: return <StepPersonal        {...props} />
      case 2: return <StepEducation       {...props} />
      case 3: return <StepSkills          {...props} />
      case 4: return <StepCertifications  {...props} />
      case 5: return <StepProjects        {...props} />
      case 6: return <StepInternships     {...props} />
      default: return null
    }
  }

  // ── Loading screen ──
  if (isProfileLoading) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex items-center justify-center bg-gradient-to-br
                   from-slate-50 via-white to-blue-50"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent
                          rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-2xl flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Build Your Profile
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Step {currentStep} of {STEPS.length} —{' '}
            {STEPS[currentStep - 1].label}
          </p>
        </div>

        {/* ── Step Indicators ── */}
        <div className="flex items-center justify-between w-full">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">

              {/* Circle */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center
                              justify-center text-sm font-bold border-2 transition-all
                              ${currentStep === step.id
                                ? 'bg-blue-600 border-blue-600 text-white scale-110'
                                : currentStep > step.id
                                ? 'bg-blue-100 border-blue-300 text-blue-600'
                                : 'bg-white border-gray-200 text-gray-400'
                              }`}
                >
                  {currentStep > step.id ? '✓' : step.icon}
                </button>
                <span
                  className={`text-xs hidden sm:block font-medium
                              ${currentStep === step.id
                                ? 'text-blue-600'
                                : currentStep > step.id
                                ? 'text-blue-400'
                                : 'text-gray-400'
                              }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line — not after last */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all
                              ${currentStep > step.id
                                ? 'bg-blue-400'
                                : 'bg-gray-200'
                              }`}
                />
              )}

            </div>
          ))}
        </div>

        {/* ── Step Content ── */}
        <div className="bg-white rounded-2xl border border-gray-200
                        shadow-sm p-6 sm:p-8">
          {renderStep()}
        </div>

      </div>
    </div>
  )
}

export default ProfileBuilder
