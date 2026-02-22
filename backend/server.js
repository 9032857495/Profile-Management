import dotenv from 'dotenv'
dotenv.config()

import express      from 'express'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import connectDB    from './config/db.js'
import authRoutes    from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import rankingRoutes from './routes/rankingRoutes.js'
import jobRoutes     from './routes/jobRoutes.js'
import learningRoutes from './routes/learningRoutes.js'
import adminRoutes   from './routes/adminRoutes.js'


const app = express()
connectDB()

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',     authRoutes)
app.use('/api/profile',  profileRoutes)
app.use('/api/rankings', rankingRoutes)
app.use('/api/jobs',     jobRoutes)
app.use('/api/learning', learningRoutes)
app.use('/api/admin',    adminRoutes)


app.get('/', (req, res) => res.send('🚀 Profile Management API is running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
