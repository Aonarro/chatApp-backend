import { Router } from 'express'
import AuthRoutes from './users.routes'

const router = Router()

router.use('/api', [AuthRoutes])

export default router
