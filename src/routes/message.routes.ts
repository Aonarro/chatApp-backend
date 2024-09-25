import { Router } from 'express'
import {
	createMessage,
	getMessagesFromConversation,
} from '../controllers/message.controller'
import { authenticatedGuard } from '../guards/auth-guards'
import { handleValidationErrors } from '../utils/helpers'
import { createMessageValidation } from '../utils/validationSchemas/messageValidationSchema'

const router = Router()

router.post(
	'/messages',
	authenticatedGuard,
	createMessageValidation,
	handleValidationErrors,
	createMessage
)

router.get(
	'/messages/:conversationId',
	authenticatedGuard,
	getMessagesFromConversation
)

export default router
