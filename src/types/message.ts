import { User } from '@prisma/client'

export type createMessageParams = {
	content: string
	conversationId: number
	user: User
}
