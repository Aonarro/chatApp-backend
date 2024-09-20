import { NextFunction, Request, Response } from 'express'
import { createConversationByParams } from '../services/conversations.service'
import { RequestUserDetails } from '../types/users'
import { errorHandler } from '../utils/helpers'

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

		console.log('result!!!!!!!!!', result)

		res.status(200).json(result)
	} catch (error) {
		errorHandler(error, res, 400)
	}
}
