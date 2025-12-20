import { Router } from 'express'
import {
  getAllInstagramData,
  getInstagramById,
  createInstagramData,
  updateInstagramData,
  deleteInstagramData
} from '../controllers/insta.controller'

const instaRoutes = Router()

instaRoutes.get('/', getAllInstagramData)
instaRoutes.get('/:id', getInstagramById)
instaRoutes.post('/add', createInstagramData)
instaRoutes.put('/edit/:id', updateInstagramData)
instaRoutes.delete('/delete/:id', deleteInstagramData)

export default instaRoutes