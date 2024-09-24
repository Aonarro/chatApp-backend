import { Router } from 'express'
import { createMessage } from '../controllers/message.controller'
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

export default router
