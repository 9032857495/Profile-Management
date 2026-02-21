import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar          from './components/Navbar'
import Home            from './pages/Home'
import Login           from './pages/Login'
import Dashboard       from './pages/Dashboard'
import Register        from './pages/Register'
import VerifyOTP       from './pages/VerifyOTP'
import ProfileBuilder  from './pages/ProfileBuilder'
import ProfileComplete from './pages/ProfileComplete'
import Rankings        from './pages/Rankings'
import useAuthStore    from './store/authStore'
import { getMe }       from './services/authService'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const data = await getMe()
        if (data.success) {
          setUser(data.user)
        } else {
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    }
    restoreUser()
  }, [setUser, setLoading])

  return (
    <div className="w-full min-h-screen flex flex-col text-left">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/build"
            element={
              <ProtectedRoute>
                <ProfileBuilder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/complete"
            element={
              <ProtectedRoute>
                <ProfileComplete />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rankings"
            element={
              <ProtectedRoute>
                <Rankings />
              </ProtectedRoute>
            }
          />

          {/* Redirect old route just in case */}
          <Route path="/profile-builder" element={<Navigate to="/profile/build" />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>
    </div>
  )
}

export default App
