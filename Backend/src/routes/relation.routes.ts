import { Router } from 'express'
import {
  getAllRelationData,
  getRelationById,
  createRelationData,
  updateRelationData,
  deleteRelationData
} from '../controllers/relation.controller'

const relationRoutes = Router()

relationRoutes.get('/', getAllRelationData)
relationRoutes.get('/:id', getRelationById)
relationRoutes.post('/add', createRelationData)
relationRoutes.put('/edit/:id', updateRelationData)
relationRoutes.delete('/delete/:id', deleteRelationData)

export default relationRoutes