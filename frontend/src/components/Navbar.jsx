import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../services/authService'

const Navbar = () => {
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    logoutStore()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold text-blue-600 tracking-tight hover:opacity-90 transition"
        >
          Profile<span className="text-gray-900">Manager</span>
        </Link>

        {/* Desktop Right Side */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Avatar + Name */}
              <div className="flex items-center gap-2.5">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
                                  text-white font-bold text-sm border-2 border-blue-500">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200" />

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="text-gray-600 text-sm font-medium hover:text-blue-600 transition"
              >
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-500 border border-red-200 px-4 py-1.5 rounded-lg
                           hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-600 text-sm font-medium hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm
                           font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300
                           ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-300
                           ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300
                           ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center
                                  justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 text-sm font-medium hover:text-blue-600 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-500 border border-red-200 py-2 rounded-lg
                           hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 text-sm font-medium hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 text-white text-center py-2 rounded-xl text-sm
                           font-semibold hover:bg-blue-700 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
