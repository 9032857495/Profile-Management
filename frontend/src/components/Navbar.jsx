import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              PM
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Profile<span className="text-blue-600">Manager</span>
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-3">

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>

                <NavLink to="/rankings" className={navLinkStyle}>
                  Rankings
                </NavLink>

                <NavLink to="/jobs" className={navLinkStyle}>
                  Jobs
                </NavLink>

                <NavLink to="/learning-paths" className={navLinkStyle}>
                  Learning
                </NavLink>

                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkStyle}>
                    Admin
                  </NavLink>
                )}

                <div className="h-6 w-px bg-gray-200 mx-2" />

                {/* User */}
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 px-5 py-2 rounded-xl text-sm font-semibold
                             bg-red-50 text-red-500 border border-red-200
                             hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkStyle}>
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold
                             bg-blue-600 text-white shadow-sm
                             hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="sm:hidden flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-700 transition ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-700 transition ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-8 py-6 flex flex-col gap-3 shadow-lg">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={navLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/rankings" onClick={() => setMenuOpen(false)} className={navLinkStyle}>
                Rankings
              </NavLink>
              <NavLink to="/jobs" onClick={() => setMenuOpen(false)} className={navLinkStyle}>
                Jobs
              </NavLink>
              <NavLink to="/learning-paths" onClick={() => setMenuOpen(false)} className={navLinkStyle}>
                Learning
              </NavLink>

              <button
                onClick={handleLogout}
                className="mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold
                           bg-red-50 text-red-500 border border-red-200
                           hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className={navLinkStyle}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center px-6 py-2.5 rounded-xl text-sm font-semibold
                           bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar