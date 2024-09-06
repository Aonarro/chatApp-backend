import { Router } from 'express'
import { register } from '../controllers/users.controller'
import { createUserValidation } from '../utils/validationSchemas/UserValidationSchema'

const router = Router()

router.post('/auth/register', createUserValidation, register)

export default router
