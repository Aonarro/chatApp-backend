import { Router } from 'express'
import { login, logout, register } from '../controllers/users.controller'
import { authenticatedGuard, localAuthGuard } from '../guards/auth-guards'
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
	localAuthGuard,
	login
)
//status
router.get('/auth/status', authenticatedGuard, status)
//logout
router.get('/auth/logout', authenticatedGuard, logout)

export default router
