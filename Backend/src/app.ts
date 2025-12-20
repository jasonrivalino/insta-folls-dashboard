import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import instaRoutes from './routes/insta.routes'
import relationRoutes from './routes/relation.routes'
import instaRelationalRoutes from './routes/instaRelational.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/insta-user-data', instaRoutes)
app.use('/api/relational-status-data', relationRoutes)
app.use('/api/insta-and-relational-user', instaRelationalRoutes)

app.get('/', (_req, res) => {
  res.send('API running 🚀')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})