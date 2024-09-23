import { body } from 'express-validator'

export const createConversationValidation = [
	body('recipientId')
		.isNumeric()
		.withMessage('Recipient ID must be a number')
		.notEmpty()
		.withMessage('Please provide a valid recipient ID'),

	body('message').notEmpty().withMessage('Message is required'),
]
