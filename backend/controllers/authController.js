import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// @route POST /api/auth/google
export const googleAuth = async (req, res) => {
  const { credential } = req.body

  try {
    // Fetch user info from Google using access token
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${credential}` } }
    )

    const profile = await response.json()
    const { name, email, picture } = profile

    if (!email) {
      return res.status(400).json({ message: 'Failed to get user info from Google' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        authProvider: 'google',
        isVerified: true,
      })
    }

    const token = generateToken(user._id)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Google Auth Error:', error)
    res.status(401).json({ message: 'Google authentication failed' })
  }
}

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}

// @route POST /api/auth/logout
export const logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}
