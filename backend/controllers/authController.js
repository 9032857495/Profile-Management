import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────────
// GOOGLE AUTH — Verify & Login/Create User
// ─────────────────────────────────────────
export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ message: "Google token required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        googleId,
        authProvider: "google",
        isVerified: true,
      });
    } else if (user.authProvider === "local") {
      return res.status(400).json({ 
        message: "Email registered with password. Use email/password login." 
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role || "user",
      }
    });
  } catch (err) {
    console.error("Google Auth error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// ─────────────────────────────────────────
// CHANGE PASSWORD — Local accounts only
// ─────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    if (user.authProvider === 'google' || !user.password) {
      return res.status(400).json({
        success: false,
        message: 'Password change only for email/password accounts',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password incorrect',
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Change Password Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};
