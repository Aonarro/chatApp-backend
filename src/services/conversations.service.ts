import { PrismaClient } from '@prisma/client'
import { CreateConversationParams } from '../types/conversations'
import { UserWithoutPassword } from '../types/users'
import { createMessageByParams } from './message.service'
import { findUser } from './users.service'

const prisma = new PrismaClient()

export const createConversationByParams = async (
	user: UserWithoutPassword,
	params: CreateConversationParams
) => {
	const { email, message } = params

	const recipient = await findUser({ email }, { includePassword: false })

	if (!recipient) {
		throw new Error('Cannot create conversation')
	}

	if (user.id === recipient.id) {
		throw new Error('Cannot create conversation with yourself')
	}

	const existingConversation = await prisma.conversation.findFirst({
		where: {
			OR: [
				{ creatorId: user.id, recipientId: recipient.id },
				{ creatorId: recipient.id, recipientId: user.id },
			],
		},
	})

	if (existingConversation) {
		throw new Error('Conversation already exists')
	}

	const newConversation = await prisma.conversation.create({
		data: {
			creatorId: user.id,
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

	await createMessageByParams({
		content: message,
		user: user,
		conversationId: newConversation.id,
	})

	const { creatorId, recipientId, messageId, ...rest } = newConversation

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
