import { Router } from 'express'
import ConversationsRoutes from './conversations.routes'
import AuthRoutes from './users.routes'

const router = Router()

router.use('/api', [AuthRoutes, ConversationsRoutes])

export default router
