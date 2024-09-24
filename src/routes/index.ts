import { Router } from 'express'
import ConversationsRoutes from './conversations.routes'
import MessageRoutes from './message.routes'
import AuthRoutes from './users.routes'

const router = Router()

router.use('/api', [AuthRoutes, ConversationsRoutes, MessageRoutes])

export default router
