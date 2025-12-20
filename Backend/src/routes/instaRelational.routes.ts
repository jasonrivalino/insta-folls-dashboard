import { Router } from 'express'
import {
    getInstaRelationalData,
    getInstaRelationalDataText,
    createInstaRelationalData,
    deleteInstaRelationalData,
} from '../controllers/instaRelational.controller'

const instaRelationalRoutes = Router()

instaRelationalRoutes.get('/get/insta-relation', getInstaRelationalData)
instaRelationalRoutes.get('/get/insta-relation-text', getInstaRelationalDataText)
instaRelationalRoutes.post('/add', createInstaRelationalData)
instaRelationalRoutes.delete('/delete', deleteInstaRelationalData)

export default instaRelationalRoutes