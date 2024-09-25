import { NextFunction, Request, Response } from 'express'
import {
	createMessageByParams,
	getMessagesByConversationId,
} from '../services/message.service'
import { RequestUserDetails } from '../types/users'

export const createMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }
		const result = await createMessageByParams({
			...typedRequest.body,
			user: typedRequest.user,
		})
		res.status(201).json(result)
	} catch (error) {
		console.error(error)
	}
}

export const getMessagesFromConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }

		const { conversationId } = req.params

		console.log(conversationId)

		const result = await getMessagesByConversationId(+conversationId)

		res.status(200).json(result)
	} catch (error) {
		console.log(error)
	}
}
