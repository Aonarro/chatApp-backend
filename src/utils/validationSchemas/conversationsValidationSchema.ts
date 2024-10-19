import { body } from 'express-validator'

export const createConversationValidation = [
	body('email')
		.isEmail()
		.withMessage('This field must be a valid email address')
		.notEmpty()
		.withMessage('Please provide a valid recipient email'),

	body('message').notEmpty().withMessage('Message is required'),
]
