import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getGlobalRankings,
  getCollegeRankings,
  getCityRankings,
} from '../services/rankingService'

const TABS = [
  { id: 'global',  label: '🌍 Global',  desc: 'Top 100 users worldwide'         },
  { id: 'college', label: '🎓 College', desc: 'Top users from your college'      },
  { id: 'city',    label: '📍 City',    desc: 'Top users from your city'         },
]

const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

const getScoreColor = (score) => {
  if (score >= 85) return 'text-green-600 bg-green-50 border-green-200'
  if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200'
  if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
  return                   'text-red-500 bg-red-50 border-red-200'
}

const Rankings = () => {
  const navigate               = useNavigate()
  const [activeTab, setTab]    = useState('global')
  const [data, setData]        = useState({ rankings: [], myRank: null, total: 0 })
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')

  // ── Fetch on tab change ──
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        let res
        if (activeTab === 'global')  res = await getGlobalRankings()
        if (activeTab === 'college') res = await getCollegeRankings()
        if (activeTab === 'city')    res = await getCityRankings()
        setData(res)
      } catch (err) {
        setError('Failed to load rankings. Try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeTab])

  return (
    <div
  style={{ minHeight: 'calc(100vh - 57px)' }}
  className="flex flex-col items-center bg-gradient-to-br
             from-slate-50 via-white to-blue-50 px-4 py-10"
>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            🏆 Rankings
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            See how you stack up against other candidates
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 bg-white border border-gray-200
                        rounded-2xl p-1.5 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold
                          transition-all duration-200
                          ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── My Rank Banner ── */}
        {!loading && data.myRank && (
          <div className="flex items-center justify-between
                          bg-blue-600 text-white rounded-2xl px-5 py-4
                          shadow-lg shadow-blue-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest
                            text-blue-200 mb-1">
                Your Rank
              </p>
              <p className="text-2xl font-extrabold">
                #{data.myRank}
                <span className="text-base font-normal text-blue-200 ml-2">
                  out of {data.total}
                </span>
              </p>
              <p className="text-blue-200 text-xs mt-0.5">
                {TABS.find((t) => t.id === activeTab)?.desc}
              </p>
            </div>
            <div className="text-5xl">
              {data.myRank === 1 ? '🥇'
               : data.myRank === 2 ? '🥈'
               : data.myRank === 3 ? '🥉'
               : '🏅'}
            </div>
          </div>
        )}

        {/* ── No data message ── */}
        {!loading && data.rankings?.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl
                          px-6 py-10 text-center flex flex-col
                          items-center gap-3">
            <span className="text-4xl">
              {activeTab === 'college' ? '🎓' : '📍'}
            </span>
            <p className="text-gray-700 font-bold text-base">
              {data.message || 'No rankings available yet.'}
            </p>
            <p className="text-gray-400 text-sm">
              {activeTab === 'college'
                ? 'Add your college in profile to see college rankings.'
                : activeTab === 'city'
                ? 'Add your city in profile to see local rankings.'
                : 'Be the first to complete your profile!'}
            </p>
            <button
              onClick={() => navigate('/profile/build')}
              className="mt-2 bg-blue-600 text-white text-sm font-bold
                         px-5 py-2.5 rounded-xl hover:bg-blue-700
                         active:scale-95 transition-all"
            >
              Complete Profile →
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500
                          text-sm rounded-xl px-4 py-3 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-10 h-10 border-4 border-blue-600
                            border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading rankings...</p>
          </div>
        )}

        {/* ── Rankings Table ── */}
        {!loading && data.rankings?.length > 0 && (
          <div className="flex flex-col gap-2">

            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold
                            text-gray-400 uppercase tracking-wide">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Name</span>
              <span className="col-span-4">College · Branch</span>
              <span className="col-span-2 text-right">Score</span>
            </div>

            {/* Rows */}
            {data.rankings.map((user) => (
              <div
                key={user.userId}
                className={`grid grid-cols-12 items-center px-4 py-3.5
                            rounded-2xl border transition-all
                            ${user.isMe
                              ? 'bg-blue-50 border-blue-300 shadow-sm'
                              : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  {medals[user.rank] ? (
                    <span className="text-xl">{medals[user.rank]}</span>
                  ) : (
                    <span className={`text-sm font-extrabold
                      ${user.isMe ? 'text-blue-600' : 'text-gray-500'}`}>
                      {user.rank}
                    </span>
                  )}
                </div>

                {/* Name + You badge */}
                <div className="col-span-5 flex items-center gap-2">
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center
                                   justify-center text-xs font-bold
                                   shrink-0 text-white
                                   ${user.isMe
                                     ? 'bg-blue-600'
                                     : 'bg-gray-400'
                                   }`}>
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate
                      ${user.isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                      {user.name}
                    </p>
                    {user.isMe && (
                      <span className="text-xs text-blue-500 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                </div>

                {/* College · Branch */}
                <div className="col-span-4 min-w-0">
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {user.college}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.branch}
                  </p>
                </div>

                {/* Score */}
                <div className="col-span-2 flex justify-end">
                  <span className={`text-xs font-extrabold px-2.5 py-1
                                    rounded-full border
                                    ${getScoreColor(user.score)}`}>
                    {user.score}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Rankings
