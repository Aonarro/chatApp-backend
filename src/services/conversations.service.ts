import { PrismaClient } from '@prisma/client'
import { CreateConversationParams } from '../types/conversations'
import { findUser } from './users.service'

const prisma = new PrismaClient()

export const createConversationByParams = async (
	id: number,
	params: CreateConversationParams
) => {
	const { email } = params

	const recipient = await findUser({ email }, { includePassword: false })

	if (!recipient) {
		throw new Error('Cannot create conversation')
	}

	if (id === recipient.id) {
		throw new Error('Cannot create conversation with yourself')
	}

	const existingConversation = await prisma.conversation.findFirst({
		where: {
			OR: [
				{ creatorId: id, recipientId: recipient.id },
				{ creatorId: recipient.id, recipientId: id },
			],
		},
	})

	if (existingConversation) {
		throw new Error('Conversation already exists')
	}

	const newConversation = await prisma.conversation.create({
		data: {
			creatorId: id,
			recipientId: recipient.id,
		},
		include: {
			lastMessageSent: {
				select: {
					id: true,
					createdAt: true,
					content: true,
					author: {
						select: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
						},
					},
				},
			},
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

	const { creatorId, recipientId, messageId, ...rest } = newConversation

	console.log(newConversation)

	return { ...rest }
}

export const findConversationByUserId = async (userId: number) => {
	const conversations = await prisma.conversation.findMany({
		where: {
			OR: [{ creatorId: userId }, { recipientId: userId }],
		},
		include: {
			lastMessageSent: {
				select: {
					id: true,
					createdAt: true,
					content: true,
					author: {
						select: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
						},
					},
				},
			},
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
		orderBy: { lastMessageSentAt: 'desc' },
	})

	const formattedConversations = conversations.map(
		({ creatorId, recipientId, messageId, ...rest }) => ({
			...rest,
		})
	)

	return formattedConversations
}
