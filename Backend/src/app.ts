import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import instagramRoutes from './routes/instaUser.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/insta-user-data', instagramRoutes)

app.get('/', (_req, res) => {
  res.send('API running 🚀')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})