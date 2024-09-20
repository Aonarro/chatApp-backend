import { PrismaClient } from '@prisma/client'
import {
	CreateParticipantParams,
	FindParticipantParams,
} from '../types/participant'

const prisma = new PrismaClient()

export const findParticipant = (params: FindParticipantParams) => {
	return prisma.participant.findFirst({
		where: {
			id: params.id,
		},
	})
}

export const createParticipant = (params: CreateParticipantParams) => {
	console.log(params)

	const participant = prisma.participant.create({
		data: {
			id: +params.id,
			userId: params.userId,
		},
	})
	return participant
}
