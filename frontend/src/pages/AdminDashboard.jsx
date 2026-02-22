import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getAdminStats, getAdminUsers } from '../services/adminService'

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [stats, setStats]       = useState(null)
  const [users, setUsers]       = useState([])
  const [page, setPage]         = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  // Guard: only admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user?.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [statsRes, usersRes] = await Promise.all([
          getAdminStats(),
          getAdminUsers(page, 10),
        ])

        if (statsRes.success) setStats(statsRes.stats)
        if (usersRes.success) {
          setUsers(usersRes.users)
          setTotalPages(usersRes.pagination.totalPages)
        }
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to load admin data.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  if (loading) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex flex-col items-center justify-center
                   bg-gradient-to-br from-slate-50 via-white to-blue-50 gap-4"
      >
        <div className="w-10 h-10 border-4 border-slate-700 border-t-transparent
                        rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading admin dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ minHeight: 'calc(100vh - 57px)' }}
        className="flex flex-col items-center justify-center
                   bg-gradient-to-br from-slate-50 via-white to-blue-50 gap-4"
      >
        <span className="text-4xl">⚠️</span>
        <p className="text-gray-500 text-sm text-center max-w-sm">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm
                     font-semibold hover:bg-blue-700 transition-all"
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 57px)' }}
      className="flex flex-col items-center bg-gradient-to-br
                 from-slate-50 via-white to-blue-50 px-4 py-10"
    >
      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Platform overview and user insights.
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            Logged in as <span className="font-semibold text-gray-700">{user?.email}</span>
          </span>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold">Total Users</span>
              <span className="text-2xl font-extrabold text-gray-900">
                {stats.totalUsers}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold">Candidates</span>
              <span className="text-2xl font-extrabold text-blue-600">
                {stats.totalCandidates}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold">Admins</span>
              <span className="text-2xl font-extrabold text-purple-600">
                {stats.totalAdmins}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold">Profiles in Rankings</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                {stats.totalProfiles}
              </span>
              <span className="text-[10px] text-gray-400">
                Avg score: {stats.averageScore}
              </span>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 font-bold text-sm">
              Recent Users
            </h2>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="text-xs text-gray-700 border-b border-gray-50">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold
                        ${u.role === 'admin'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-xs text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border
                  ${page === 1
                    ? 'opacity-40 cursor-not-allowed bg-white border-gray-200 text-gray-400'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border
                  ${page === totalPages
                    ? 'opacity-40 cursor-not-allowed bg-white border-gray-200 text-gray-400'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
