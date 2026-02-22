import express      from 'express'
import dotenv       from 'dotenv'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import connectDB    from './config/db.js'
import authRoutes    from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import rankingRoutes from './routes/rankingRoutes.js'  // ← NEW
import adminRoutes from './routes/adminRoutes.js'


dotenv.config()

const app = express()

connectDB()

app.use(cors({
  origin:      process.env.CLIENT_URL,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',     authRoutes)
app.use('/api/profile',  profileRoutes)
app.use('/api/rankings', rankingRoutes)                // ← NEW
app.use('/api/admin', adminRoutes)


app.get('/', (req, res) => {
  res.send('🚀 Profile Management API is running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
