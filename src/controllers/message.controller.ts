import { NextFunction, Request, Response } from 'express'
import {
	createMessageByParams,
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

		const result = await createMessageByParams({
			...typedRequest.body,
			user: typedRequest.user,
		})

		eventEmitter.emit('createMessage', result)
		res.status(201).json(result)
	} catch (error) {
		errorHandler(error, res, 400)
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
