import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { UserWithoutPassword } from '../types/users'
import { errorHandler } from '../utils/helpers'

export const localAuthGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	passport.authenticate(
		'local',
		(err: any, user: UserWithoutPassword | false, info: any) => {
			if (err) {
				return errorHandler(err, res)
			}
			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}
			req.logIn(user, (loginErr: any) => {
				if (loginErr) {
					return errorHandler(loginErr, res)
				}
				return next()
			})
		}
	)(req, res, next)
}

export const authenticatedGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.status(403).json({ message: 'Forbidden resource' })
}
