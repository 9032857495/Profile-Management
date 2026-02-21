import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../services/authService'

const Dashboard = () => {
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = async () => {
    await logout()
    logoutStore()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}
         className="flex flex-col items-center justify-center bg-gray-50 gap-6">

      {/* Avatar */}
      {user?.avatar && (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full border-4 border-blue-500"
        />
      )}

      <h1 className="text-4xl font-bold text-gray-800">
        Welcome, {user?.name}! 🎉
      </h1>
      <p className="text-gray-500">{user?.email}</p>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-lg 
                   hover:bg-red-600 transition font-medium"
      >
        Logout
      </button>

    </div>
  )
}

export default Dashboard
