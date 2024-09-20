import { body } from 'express-validator'

export const createConversationValidation = [
	body('authorId')
		.isNumeric()
		.withMessage('Author ID must be a number')
		.notEmpty()
		.withMessage('Please provide a valid author ID'),
	body('recipientId')
		.isNumeric()
		.withMessage('Recipient ID must be a number')
		.notEmpty()
		.withMessage('Please provide a valid recipient ID'),

	body('message').notEmpty().withMessage('Message is required'),
]
