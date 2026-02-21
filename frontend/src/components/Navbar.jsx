import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../services/authService'

const Navbar = () => {
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    logoutStore()
    navigate('/login')
  }

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        ProfileManager
      </Link>

      {/* Right Side */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full border-2 border-blue-500"
          />
          <span className="text-gray-700 font-medium">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-red-600 transition font-medium text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg 
                     font-medium hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      )}

    </nav>
  )
}

export default Navbar
