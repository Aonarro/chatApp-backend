import { body } from 'express-validator'

export const createUserValidation = [
	body('email').isEmail().withMessage('Please provide a valid email'),
	body('firstName').notEmpty().withMessage('First name is required'),
	body('lastName').notEmpty().withMessage('Last name is required'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
]

export const loginUserValidation = [
	body('email')
		.isEmail()
		.withMessage('Please provide a valid email')
		.notEmpty()
		.withMessage('Email is required'),
	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
]
