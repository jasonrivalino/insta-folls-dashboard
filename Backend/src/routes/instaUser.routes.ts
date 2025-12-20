import { Router } from 'express'
import {
  getAllInstagramData,
  getInstagramById,
  createInstagramData,
  updateInstagramData,
  deleteInstagramData
} from '../controllers/instaUser.controller'

const router = Router()

router.get('/', getAllInstagramData)
router.get('/:id', getInstagramById)
router.post('/add', createInstagramData)
router.put('/edit/:id', updateInstagramData)
router.delete('/delete/:id', deleteInstagramData)

export default router