const ScoreCard = ({ profile }) => {
  const score = profile?.score || 0

  const breakdown = [
    {
      label:   'CGPA',
      icon:    '⭐',
      earned:  profile?.cgpa
                 ? Math.round((profile.cgpa / 10) * 25)
                 : 0,
      max:     25,
      detail:  profile?.cgpa ? `${profile.cgpa} / 10` : 'Not added',
    },
    {
      label:   'Skills',
      icon:    '🧠',
      earned:  profile?.skills?.length > 0
                 ? Math.min(profile.skills.length, 10) * 2
                 : 0,
      max:     20,
      detail:  profile?.skills?.length > 0
                 ? `${profile.skills.length} skill${profile.skills.length > 1 ? 's' : ''}`
                 : 'Not added',
    },
    {
      label:   'Projects',
      icon:    '💻',
      earned:  profile?.projects?.length > 0
                 ? Math.min(profile.projects.length, 5) * 5
                 : 0,
      max:     25,
      detail:  profile?.projects?.length > 0
                 ? `${profile.projects.length} project${profile.projects.length > 1 ? 's' : ''}`
                 : 'Not added',
    },
    {
      label:   'Certifications',
      icon:    '📜',
      earned:  profile?.certifications?.length > 0
                 ? Math.min(profile.certifications.length, 5) * 3
                 : 0,
      max:     15,
      detail:  profile?.certifications?.length > 0
                 ? `${profile.certifications.length} certification${profile.certifications.length > 1 ? 's' : ''}`
                 : 'Not added',
    },
    {
      label:   'Internships',
      icon:    '🏢',
      earned:  profile?.internships?.length > 0
                 ? Math.min(profile.internships.length, 3) * 5
                 : 0,
      max:     15,
      detail:  profile?.internships?.length > 0
                 ? `${profile.internships.length} internship${profile.internships.length > 1 ? 's' : ''}`
                 : 'Not added',
    },
  ]

  // ── Score label ──
  const getLabel = (s) => {
    if (s >= 85) return { text: 'Excellent 🔥',  color: 'text-green-600'  }
    if (s >= 65) return { text: 'Good 👍',        color: 'text-blue-600'   }
    if (s >= 40) return { text: 'Average 📈',     color: 'text-amber-500'  }
    return              { text: 'Needs Work 💪',  color: 'text-red-400'    }
  }

  const label = getLabel(score)

  return (
    <div className="bg-white rounded-2xl border border-gray-200
                    shadow-sm p-6 flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">
            Profile Score
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Based on your profile details
          </p>
        </div>

        {/* Big Score */}
        <div className="flex flex-col items-end">
          <span className="text-4xl font-extrabold text-gray-900">
            {score}
            <span className="text-lg text-gray-300 font-bold">/100</span>
          </span>
          <span className={`text-xs font-bold ${label.color}`}>
            {label.text}
          </span>
        </div>
      </div>

      {/* ── Overall Bar ── */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000
            ${score >= 85
              ? 'bg-green-500'
              : score >= 65
              ? 'bg-blue-600'
              : score >= 40
              ? 'bg-amber-400'
              : 'bg-red-400'
            }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* ── Breakdown ── */}
      <div className="flex flex-col gap-3">
        {breakdown.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">

            {/* Row header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {item.label}
                </span>
                <span className="text-xs text-gray-400">
                  — {item.detail}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-700">
                {item.earned}
                <span className="text-gray-300 font-normal">/{item.max}</span>
              </span>
            </div>

            {/* Mini bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-700
                  ${item.earned === item.max
                    ? 'bg-green-500'
                    : item.earned > 0
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                  }`}
                style={{ width: `${(item.earned / item.max) * 100}%` }}
              />
            </div>

          </div>
        ))}
      </div>

      {/* ── Tip ── */}
      {score < 100 && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl
                      px-4 py-3 border border-gray-100">
          💡 <span className="font-semibold text-gray-600">Tip:</span>{' '}
          {!profile?.cgpa
            ? 'Add your CGPA to earn up to 25 points.'
            : profile?.projects?.length === 0
            ? 'Add projects to earn up to 25 points.'
            : profile?.skills?.length < 10
            ? `Add ${10 - profile.skills.length} more skill${10 - profile.skills.length > 1 ? 's' : ''} to max out skill points.`
            : profile?.certifications?.length === 0
            ? 'Add certifications to earn up to 15 points.'
            : 'Add internships to earn up to 15 points.'
          }
        </p>
      )}

    </div>
  )
}

export default ScoreCard
