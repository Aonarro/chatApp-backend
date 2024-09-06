import { PrismaClient } from '@prisma/client'
import { ICreateUserCredentials } from '../types/users'
import { HttpException } from '../utils/error'
import { hashPassword } from '../utils/helpers'

const prisma = new PrismaClient()

export const createUser = async (userDetails: ICreateUserCredentials) => {
	const existingUser = await prisma.user.findUnique({
		where: { email: userDetails.email },
	})

	if (existingUser) {
		throw new HttpException('User with this email already exists', 409)
		console.log(existingUser)
	}

	const hashedPassword = await hashPassword(userDetails.password)

	const newUser = await prisma.user.create({
		data: {
			...userDetails,
			password: hashedPassword,
		},
	})

	return newUser
}
