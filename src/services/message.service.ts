import { PrismaClient } from '@prisma/client'
import { createMessageParams } from '../types/message'

const prisma = new PrismaClient()

export const createMessageByParams = async (params: createMessageParams) => {
	const conversation = await prisma.conversation.findFirst({
		where: {
			id: +params.conversationId,
		},
	})

	if (!conversation) {
		throw new Error('Conversation not found')
	}
	const { creatorId, recipientId } = conversation

	if (creatorId !== params.user.id && recipientId !== params.user.id) {
		throw new Error(
			'You are not authorized to create a message in this conversation'
		)
	}

	const newMessage = await prisma.message.create({
		data: {
			content: params.content,
			conversationId: +params.conversationId,
			authorId: +params.user.id,

			// createdAt: Date.now(),
		},
	})

	await prisma.conversation.update({
		where: { id: +params.conversationId },
		data: {
			lastMessageSent: {
				connect: { id: newMessage.id },
			},
			lastMessageSentAt: newMessage.createdAt,
		},
	})

	const newMessageResponseData = await prisma.message.findFirst({
		where: { id: newMessage.id },
		select: {
			id: true,
			createdAt: true,
			conversation: {
				select: {
					id: true,
					createdAt: true,
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
			},
			author: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
				},
			},
			content: true,
		},
	})

	console.log('IN MESSAGEEEEE', newMessageResponseData)

	if (newMessageResponseData) {
		const formattedMessage = {
			message: {
				id: newMessageResponseData.id,
				content: newMessageResponseData.content,
				createdAt: newMessageResponseData.createdAt,
				author: {
					id: newMessageResponseData.author.id,
					email: newMessageResponseData.author.email,
					firstName: newMessageResponseData.author.firstName,
					lastName: newMessageResponseData.author.lastName,
				},
			},
			conversation: {
				id: newMessageResponseData.conversation.id,
				createdAt: newMessageResponseData.conversation.createdAt,
				creator: {
					id: newMessageResponseData.conversation.creator.id,
					email: newMessageResponseData.conversation.creator.email,
					firstName: newMessageResponseData.conversation.creator.firstName,
					lastName: newMessageResponseData.conversation.creator.lastName,
				},
				recipient: {
					id: newMessageResponseData.conversation.recipient.id,
					email: newMessageResponseData.conversation.recipient.email,
					firstName: newMessageResponseData.conversation.recipient.firstName,
					lastName: newMessageResponseData.conversation.recipient.lastName,
				},
				lastMessageSent: newMessageResponseData.conversation.lastMessageSent,
			},
		}
		return formattedMessage
	}

	// console.log(newMessageResponseData)
}

export const getMessagesByConversationId = async (conversationId: number) => {
	const messages = await prisma.message.findMany({
		where: { conversationId },
		select: {
			id: true,
			content: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	})

	return messages

	// messages.map((message) => ({
	// 	id: message.id,
	// 	content: message.content,
	// 	createdAt: message.createdAt,
	// 	author: message.author.id, // Здесь возвращаем только id
	// }))
}
