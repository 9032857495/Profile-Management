import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },

    // ── Step 1: Personal Info ──
    phone: { type: String, default: '' },
    city:  { type: String, default: '', index: true },
    state: { type: String, default: '' },

    // ── Step 2: Education ──
    college:        { type: String, default: '', index: true },
    degree:         { type: String, default: '' },
    branch:         { type: String, default: '' },
    cgpa:           { type: Number, default: null, min: 0, max: 10 },
    graduationYear: { type: Number, default: null },

    // ── Step 3: Skills ──
    skills: [{ type: String }],

    // ── Step 4: Certifications ──
    certifications: [
      {
        title:  { type: String, required: true },
        issuer: { type: String, default: '' },
        year:   { type: Number, default: null },
        link:   { type: String, default: '' },
      },
    ],

    // ── Step 5: Projects ──
    projects: [
      {
        title:       { type: String, required: true },
        description: { type: String, default: '' },
        techStack:   [{ type: String }],
        link:        { type: String, default: '' },
      },
    ],

    // ── Step 6: Internships ──
    internships: [
      {
        company:     { type: String, required: true },
        role:        { type: String, default: '' },
        duration:    { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],

    // ── Meta ──
    completionPercent: { type: Number, default: 0 },
    score:             { type: Number, default: 0 },  // ← NEW
  },
  { timestamps: true }
)

// ── Auto-calculate completion % + score before every save ──
profileSchema.pre('save', async function () {

  // ── Completion % ──
  let percent = 0
  if (this.phone || this.city)                               percent += 20
  if (this.college && this.cgpa)                             percent += 20
  if (this.skills && this.skills.length > 0)                 percent += 20
  if (this.certifications && this.certifications.length > 0) percent += 10
  if (this.projects && this.projects.length > 0)             percent += 20
  if (this.internships && this.internships.length > 0)       percent += 10
  this.completionPercent = percent

  // ── Score / 100 ──
  let score = 0

  // CGPA — 25pts max
  if (this.cgpa) {
    score += Math.round((this.cgpa / 10) * 25)
  }

  // Skills — 20pts max (2pts each, capped at 10)
  if (this.skills && this.skills.length > 0) {
    score += Math.min(this.skills.length, 10) * 2
  }

  // Projects — 25pts max (5pts each, capped at 5)
  if (this.projects && this.projects.length > 0) {
    score += Math.min(this.projects.length, 5) * 5
  }

  // Certifications — 15pts max (3pts each, capped at 5)
  if (this.certifications && this.certifications.length > 0) {
    score += Math.min(this.certifications.length, 5) * 3
  }

  // Internships — 15pts max (5pts each, capped at 3)
  if (this.internships && this.internships.length > 0) {
    score += Math.min(this.internships.length, 3) * 5
  }

  this.score = score
})

export default mongoose.model('Profile', profileSchema)
