import { useGoogleLogin } from '@react-oauth/google'
import { googleLogin } from '../../services/authService'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const GoogleAuthButton = () => {
  const { setUser, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        const data = await googleLogin(tokenResponse.access_token)
        setUser(data.user)
        navigate('/dashboard')
      } catch (error) {
        console.error('Login failed:', error)
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      console.error('Google Login Failed')
    },
  })

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center gap-3 border border-gray-300
                 rounded-lg px-4 py-3 hover:bg-gray-50 transition font-medium 
                 text-gray-700 cursor-pointer"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  )
}

export default GoogleAuthButton
