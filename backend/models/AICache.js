import mongoose from 'mongoose'

const AICacheSchema = new mongoose.Schema(
  {
    userId:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['jobs', 'learning'],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // stores jobs[] or paths[]
      required: true,
    },
    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// ── Compound index: one cache entry per user per type ──
AICacheSchema.index({ userId: 1, type: 1 }, { unique: true })

const AICache = mongoose.model('AICache', AICacheSchema)
export default AICache
