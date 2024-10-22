import { Router } from 'express'
import {
	createMessage,
	deleteMessageFromConversation,
	getMessagesFromConversation,
} from '../controllers/message.controller'
import { authenticatedGuard } from '../guards/auth-guards'
import { handleValidationErrors } from '../utils/helpers'
import { createMessageValidation } from '../utils/validationSchemas/messageValidationSchema'

const router = Router()

router.post(
	'/conversations/:conversationId/messages',
	authenticatedGuard,
	createMessageValidation,
	handleValidationErrors,
	createMessage
)

router.get(
	'/conversations/:conversationId/messages',
	authenticatedGuard,
	getMessagesFromConversation
)

router.delete(
	'/conversations/:conversationId/messages/:messageId',
	authenticatedGuard,
	deleteMessageFromConversation
)

export default router
