import * as bcrypt from 'bcrypt'
import { Response } from 'express'

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
