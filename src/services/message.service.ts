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
			lastMessageSent: newMessage.content,
			lastMessageSentAt: new Date(),
		},
	})

	return newMessage
}
