import { Message, User } from '@prisma/client'

export type CreateConversationParams = {
	email: string
	message: string
}

export type Conversation = {
	id: number
	creator: User
	recipient: User
	createdAt: string
	lastMessageSent: Message
}
