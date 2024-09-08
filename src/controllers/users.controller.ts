import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createUser } from '../services/users.service'

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req)
	try {
		if (!errors.isEmpty()) {
			return res.status(409).json(errors.array)
		}
		const user = await createUser(req.body)
		res.status(201).json(user)
	} catch (error) {
		next(error)
	}
}

export const login = (req: Request, res: Response, next: NextFunction) => {}

export const status = (req: Request, res: Response, next: NextFunction) => {
	return req.user ? res.send(req.user) : res.sendStatus(401)
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.user)

	if (!req.user) return res.sendStatus(401)
	req.logout(err => {
		if (err) return res.sendStatus(400)
		res.sendStatus(200)
	})
}
