import { PrismaClient } from '@prisma/client'
import {
	CreateUserCredentials,
	FindUserOptions,
	FindUserParams,
} from '../types/users'
import { hashPassword } from '../utils/helpers'

const prisma = new PrismaClient()

export const createUser = async (userDetails: CreateUserCredentials) => {
	const existingUser = await prisma.user.findUnique({
		where: { email: userDetails.email },
	})

	if (existingUser) {
		throw new Error('User with this email already exists')
	}

	const hashedPassword = await hashPassword(userDetails.password)

	const newUser = await prisma.user.create({
		data: {
			...userDetails,
			password: hashedPassword,
		},
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			password: false,
		},
	})

	return newUser
}

export const findUser = async (
	params: FindUserParams,
	options?: FindUserOptions
) => {
	return await prisma.user.findFirst({
		where: { ...params },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			password: options?.includePassword || false,
		},
	})
}
