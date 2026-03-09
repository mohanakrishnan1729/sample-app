const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─────────────────────────────────────
// Middleware
// ─────────────────────────────────────
app.use(express.json())

// CORS — reads frontend URL from .env
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ],
  credentials: true
}))

// ─────────────────────────────────────
// Routes
// ─────────────────────────────────────

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Todo API is running!' })
})

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

// Task routes
app.use('/api/tasks', taskRoutes)

// ─────────────────────────────────────
// Connect MongoDB → Start Server
// ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!')
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    )
  })
  .catch((err) => console.log('❌ DB Connection Error:', err.message))
