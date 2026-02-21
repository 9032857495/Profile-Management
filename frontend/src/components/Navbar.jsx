import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold text-blue-600">
        ProfileManager
      </Link>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Sign In
      </Link>
    </nav>
  )
}

export default Navbar
