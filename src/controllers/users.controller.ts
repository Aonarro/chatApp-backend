import { NextFunction, Request, Response } from 'express'
import { createUser } from '../services/users.service'
import { errorHandler } from '../utils/helpers'

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await createUser(req.body)

		await new Promise((resolve, reject) => {
			req.login(user, (err) => {
				if (err) {
					return reject(err)
				}
				resolve(next)
			})
		})

		res.status(201).json(user)
	} catch (error) {
		errorHandler(error, res)
	}
}

export const login = (req: Request, res: Response, next: NextFunction) => {
	req.sessionStore.get(req.sessionID, (err, session) => {})
	res.status(200).json(req.user)
}

export const status = (req: Request, res: Response, next: NextFunction) => {
	res.send(req.user).status(200)
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
	req.logout((err) => {
		return err ? res.sendStatus(400) : res.sendStatus(200)
	})
	res.clearCookie('connect.sid')
}
