import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createUser } from '../services/users.service'
import { HttpException } from '../utils/error'

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req)
	try {
		if (!errors.isEmpty()) {
			throw new HttpException(errors.array(), 409)
		}
		const user = await createUser(req.body)
		console.log(user)
		res.status(201).json('1')
	} catch (error) {
		next(error)
	}
}
