import { PrismaClient } from '@prisma/client'
import { CreateConversationParams } from '../types/conversations'
import { findUser } from './users.service'

const prisma = new PrismaClient()

export const createConversationByParams = async (
	id: number,
	params: CreateConversationParams
) => {
	console.log(id, params)

	const { recipientId, message } = params

	const recipient = await findUser(
		{ id: +recipientId },
		{ includePassword: false }
	)

	console.log(recipient)

	if (!recipient) {
		throw new Error('Cannot create conversation')
	}

	if (id === recipientId) {
		throw new Error('Cannot create conversation with yourself')
	}

	const existingConversation = await prisma.conversation.findFirst({
		where: {
			OR: [{ creatorId: id, recipientId: +recipientId }],
		},
	})

	console.log('conversation', existingConversation)

	if (existingConversation) {
		throw new Error('Conversation already exists')
	}

	const newConversation = await prisma.conversation.create({
		data: {
			creatorId: id,
			recipientId: +recipientId,
		},
	})

	return newConversation
}

export const findConversationByUserId = async (userId: number) => {
	const conversations = await prisma.conversation.findMany({
		where: {
			OR: [{ creatorId: userId }, { recipientId: userId }],
		},
		include: {
			creator: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
				},
			},
			recipient: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
				},
			},
		},
	})

	const formattedConversations = conversations.map(
		({ creatorId, recipientId, ...rest }) => ({
			...rest,
		})
	)

	return formattedConversations
}
