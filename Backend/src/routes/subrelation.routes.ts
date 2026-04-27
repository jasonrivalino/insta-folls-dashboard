import { Router } from 'express'
import {
  getAllSubrelationData,
  getSubrelationById,
  createSubrelationData,
  updateSubrelationData,
  deleteSubrelationData
} from '../controllers/subrelation.controller'

const subrelationRoutes = Router()

subrelationRoutes.get('/', getAllSubrelationData)
subrelationRoutes.get('/:id', getSubrelationById)
subrelationRoutes.post('/add', createSubrelationData)
subrelationRoutes.put('/edit/:id', updateSubrelationData)
subrelationRoutes.delete('/delete/:id', deleteSubrelationData)

export default subrelationRoutes