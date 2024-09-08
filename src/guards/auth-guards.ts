import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

// Middleware для аутентификации с помощью Passport
export const localAuthGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err)
		if (!user) return res.status(401).json({ message: 'Unauthorized' })
		req.logIn(user, err => {
			if (err) return next(err)
			return next()
		})
	})(req, res, next)
}

// Middleware для проверки, что пользователь аутентифицирован
export const authenticatedGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.status(401).json({ message: 'Unauthorized' })
}
