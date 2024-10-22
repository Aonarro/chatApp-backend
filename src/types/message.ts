import { UserWithoutPassword } from './users'

export type createMessageParams = {
	content: string
	conversationId: number
	user: UserWithoutPassword
}

type Author = {
	id: number
	email: string
	firstName: string
	lastName: string
}

type Message = {
	id: number
	content: string
	createdAt: Date
	author: Author
}

type Conversation = {
	id: number
	createdAt: Date
	creator: Author
	recipient: Author
	lastMessageSent: string
}

export type CreateMessageResponse = {
	message: Message
	conversation: Conversation
}

export type DeleteMessageParams = {
	userId: number
	conversationId: number
	messageId: number
}
