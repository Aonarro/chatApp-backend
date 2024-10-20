import { NextFunction, Request, Response } from 'express'
import {
	createConversationByParams,
	findConversationByUserId,
} from '../services/conversations.service'
import { RequestUserDetails } from '../types/users'
import { errorHandler } from '../utils/helpers'
import { eventEmitter } from '../websocket/websocket'

export const createConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }

		const result = await createConversationByParams(
			typedRequest.user.id,
			req.body
		)
		eventEmitter.emit('createConversation', result)
		res.status(200).json(result)
	} catch (error) {
		errorHandler(error, res, 400)
	}
}

export const getConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }
		const result = await findConversationByUserId(typedRequest.user.id)

		res.status(200).json(result)
	} catch (error) {
		errorHandler(error, res, 404)
	}
}
