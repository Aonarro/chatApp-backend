import { body } from 'express-validator'

export const createMessageValidation = [
	body('content')
		.isString()
		.withMessage('Content must be a string')
		.notEmpty()
		.withMessage('Please provide a content'),
]
