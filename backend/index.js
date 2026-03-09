const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())

// ⚠️ In production with Nginx, CORS is NOT needed
// because React and Express share the same domain.
// We only enable it for local development!
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173' }))
  console.log('🔓 CORS enabled for local development')
}

// Routes
app.use('/api/tasks', taskRoutes)

// Health check route — Nginx uses this to verify server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

// Connect MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!')
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    )
  })
  .catch((err) => console.log('❌ DB Connection Error:', err.message))
