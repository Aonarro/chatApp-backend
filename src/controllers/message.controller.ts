import { NextFunction, Request, Response } from 'express'
import { createMessageByParams } from '../services/message.service'
import { RequestUserDetails } from '../types/users'

export const createMessage = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const typedRequest = req as Request & { user: RequestUserDetails }
		const result = createMessageByParams({
			...typedRequest.body,
			user: typedRequest.user,
		})
		res.status(201).json(result)
	} catch (error) {
		console.error(error)
	}
}
