import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../utils/error'

export const errorMiddleware = (
	err: HttpException,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('Error details:', err.errors)

	const status = err.statusCode || 500

	res.status(status).json({
		status,
		errors: err.errors,
	})
}
