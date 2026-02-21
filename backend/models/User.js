import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: '' },
    password: { type: String, default: null },
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'local',
    },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['candidate', 'admin'],
      default: 'candidate',
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
