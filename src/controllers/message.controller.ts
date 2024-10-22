import { NextFunction, Request, Response } from 'express'
import {
	createMessageByParams,
	deleteMessageById,
	getMessagesByConversationId,
} from '../services/message.service'
import { RequestUserDetails } from '../types/users'
import { errorHandler } from '../utils/helpers'
import { eventEmitter } from '../websocket/websocket'

export const createMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }
		const { conversationId } = typedRequest.params
		const { content } = typedRequest.body

		console.log(conversationId, typedRequest.user, content)

		const result = await createMessageByParams({
			conversationId: +conversationId,
			user: typedRequest.user,
			content,
		})

		eventEmitter.emit('createMessage', result)
		res.status(201).json(result)
	} catch (error) {
		errorHandler(error, res, 500)
	}
}

export const getMessagesFromConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }

		const { conversationId } = typedRequest.params

		const messages = await getMessagesByConversationId(+conversationId)

		const result = {
			id: +conversationId,
			messages,
		}

		res.status(200).json(result)
	} catch (error) {
		errorHandler(error, res, 404)
	}
}

export const deleteMessageFromConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }
		const { conversationId, messageId } = typedRequest.params

		await deleteMessageById({
			conversationId: +conversationId,
			messageId: +messageId,
			userId: typedRequest.user.id,
		})

		res.sendStatus(204)
	} catch (error) {
		errorHandler(error, res, 404)
	}
}
