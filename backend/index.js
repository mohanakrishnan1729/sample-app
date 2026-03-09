const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// ✅ Secure CORS using environment variable
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.get('/', (req, res) => {
  res.json({ message: '🚀 Todo API is running!' })
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

app.use('/api/tasks', taskRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!')
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    )
  })
  .catch((err) => console.log('❌ DB Connection Error:', err.message))
