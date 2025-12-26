import { Router } from 'express'
import { getMainAccount, updateMainAccount } from '../controllers/accountCenter.controller'

const accountCenterRoutes = Router()

accountCenterRoutes.get('/', getMainAccount)
accountCenterRoutes.put('/change', updateMainAccount)

export default accountCenterRoutes