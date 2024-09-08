import { NextFunction, Request, Response } from 'express'
import { body, Result, validationResult } from 'express-validator'

type LoginValidationError = {
	msg: string
}

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

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result: Result = validationResult(req)

	const errors: LoginValidationError[] = result
		.formatWith(({ msg }) => ({
			msg,
		}))
		.array()

	if (!result.isEmpty()) {
		return res.status(400).json({
			errors,
		})
	}
	next()
}
