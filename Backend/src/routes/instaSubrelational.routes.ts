import { Router } from 'express'
import { 
    createInstaSubrelationalData, 
    deleteInstaSubrelationalData 
} from '../controllers/instaSubrelational.controller'

const instaSubrelationalRoutes = Router()

instaSubrelationalRoutes.post('/add', createInstaSubrelationalData)
instaSubrelationalRoutes.delete('/delete', deleteInstaSubrelationalData)

export default instaSubrelationalRoutes