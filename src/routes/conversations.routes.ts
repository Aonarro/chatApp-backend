import { Router } from 'express'
import {
	createConversation,
	getConversations,
} from '../controllers/conversations.controller'
import { authenticatedGuard } from '../guards/auth-guards'
import { handleValidationErrors } from '../utils/helpers'
import { createConversationValidation } from '../utils/validationSchemas/conversationsValidationSchema'

const router = Router()
//create new conversation
router.post(
	'/conversations',
	createConversationValidation,
	handleValidationErrors,
	authenticatedGuard,
	createConversation
)

router.get('/conversations', authenticatedGuard, getConversations)

export default router
