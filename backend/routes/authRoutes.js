import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendOTP from "../utils/sendOTP.js";
import TempUser from "../models/TempUser.js";
import User from "../models/User.js";
import { googleAuth, changePassword } from "../controllers/authController.js";

const router = express.Router();

// ─────────────────────────────────────────
// GOOGLE AUTH — POST /auth/google
// ─────────────────────────────────────────
router.post("/google", googleAuth);

// ─────────────────────────────────────────
// REGISTER — Step 1: Send OTP POST /auth/register
// ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 12); // salt 12

    await TempUser.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────
// VERIFY OTP — Step 2: Create Account POST /auth/verify-otp
// ─────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ message: "OTP expired or not found. Please register again." });
    }
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
    if (tempUser.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    const newUser = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      authProvider: "local",
      isVerified: true,
    });

    await TempUser.deleteOne({ email });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role || "user",
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────
// LOGIN — POST /auth/login
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No account found. Please register first." });
    }
    if (user.authProvider === "google") {
      return res.status(400).json({ message: "This email is registered with Google. Please use Google Login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
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
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role || "user",
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────
// GET ME — GET /auth/me
// ─────────────────────────────────────────
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false });

    res.status(200).json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role || "user",
      }
    });
  } catch (err) {
    res.status(401).json({ success: false });
  }
});

// ─────────────────────────────────────────
// CHANGE PASSWORD — POST /auth/change-password (SINGLE ROUTE)
// ─────────────────────────────────────────
router.post("/change-password", changePassword);

// ─────────────────────────────────────────
// LOGOUT — POST /auth/logout
// ─────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
