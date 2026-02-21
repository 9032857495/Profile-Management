import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import useAuthStore from './store/authStore'
import { getMe } from './services/authService'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent 
                        rounded-full animate-spin"></div>
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
        setLoading(false)     // ← not logged in, stop loading
      }
    }
    restoreUser()
  }, [setUser, setLoading])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
