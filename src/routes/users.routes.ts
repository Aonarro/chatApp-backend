import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logout, register } from '../controllers/users.controller'
import '../strategies/local-strategy'
import {
	createUserValidation,
	handleValidationErrors,
	loginUserValidation,
} from '../utils/validationSchemas/userValidationSchema'
import { status } from './../controllers/users.controller'

const router = Router()
//register
router.post(
	'/auth/register',
	createUserValidation,
	handleValidationErrors,
	register
)
//login
router.post(
	'/auth/login',
	loginUserValidation,
	handleValidationErrors,
	passport.authenticate('local'),
	(req: Request, res: Response) => {
		res.status(201).json({ msg: 'login successful' })
	}
)
//status
router.get('/auth/status', status)
//logout
router.get('/auth/logout', logout)

export default router
