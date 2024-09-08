import * as bcrypt from 'bcrypt'
import { ValidateUserDetails } from '../types/users'
import { findUser } from './users.service'

export const validateUser = async ({
	password,
	email,
}: ValidateUserDetails) => {
	const user = await findUser({ email }, { includePassword: true })

	if (!user) {
		throw new Error('Invalid Credentials')
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		throw new Error('Invalid Credentials')
	}

	const { password: _, ...userWithoutPassword } = user

	return isPasswordValid ? userWithoutPassword : false
}
