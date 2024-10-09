import { Router } from 'express'
import { login, logout, register } from '../controllers/users.controller'
import { authenticatedGuard, localAuthGuard } from '../guards/auth-guards'
import '../strategies/local-strategy'
import { handleValidationErrors } from '../utils/helpers'
import {
	createUserValidation,
	loginUserValidation,
} from '../utils/validationSchemas/userValidationSchema'
import { status } from './../controllers/users.controller'

const router = Router()
router.post(
	'/auth/register',
	createUserValidation,
	handleValidationErrors,
	register
)

router.post(
	'/auth/login',
	loginUserValidation,
	handleValidationErrors,
	localAuthGuard,
	login
)

router.get('/auth/status', authenticatedGuard, status)

router.get('/auth/logout', authenticatedGuard, logout)

export default router
