import * as bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { Result, validationResult } from 'express-validator'
type LoginValidationError = {
	msg: string
}

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt()
	return bcrypt.hash(password, salt)
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
	return bcrypt.compare(rawPassword, hashedPassword)
}

export const errorHandler = (
	error: unknown,
	res: Response,
	status?: number,
	customMessage?: string
) => {
	if (error instanceof Error) {
		const message = customMessage || error.message
		const statusCode = status || 400

		return res.status(statusCode).json({ message })
	}

	return res
		.status(500)
		.json({ message: customMessage || 'Unknown error occurred' })
}

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result: Result = validationResult(req)

	const errors: LoginValidationError[] = result
		.formatWith(({ msg }) => msg)
		.array()

	if (!result.isEmpty()) {
		return res.status(400).json({
			errors,
		})
	}
	next()
}
