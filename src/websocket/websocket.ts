import EventEmitter from 'events'
import { Server as HttpServer, IncomingMessage } from 'http'
import passport from 'passport'
import { Server, Socket } from 'socket.io'
import { sessionMiddleware } from '..'
import { wrap } from '../middlewares/websocketSessionMiddleware'
import { CreateMessageResponse } from '../types/message'
import { AuthenticatedSocket } from '../types/websocketSessions'

export type IncomingMessageWithPassport = IncomingMessage & {
	isAuthenticated: () => boolean
	user?: any
}

export const eventEmitter = new EventEmitter()

export const initializeSocket = (server: HttpServer) => {
	const io = new Server(server, {
		cors: {
			origin: 'http://localhost:5173',
			methods: ['GET', 'POST'],
			credentials: true,
		},
	})

	io.use(wrap(sessionMiddleware))
	io.use(wrap(passport.initialize()))
	io.use(wrap(passport.session()))
	io.use((socket, next) => {
		const req = socket.request as IncomingMessageWithPassport

		console.log(
			'1321y732167831728637821678361276378216312737261736128',
			req.isAuthenticated()
		)

		if (req.isAuthenticated()) {
			return next()
		}

		return next(new Error('Unauthorized1234'))
	})

	////////////////////////////////////////////////////////////////////////////////////////
	io.on('connection', (socket: Socket) => {
		const req = socket.request as IncomingMessageWithPassport
		socket.emit('Connected to the chat', { status: 'good' })

		console.log(req)

		setUserSocket(req.user.id, socket)
	})
}

eventEmitter.on('createMessage', (data: CreateMessageResponse) => {
	console.log('User created event received', data)

	const {
		message: { author },
		conversation: { creator, recipient },
	} = data
	const authorSocket = getUserSocket(author.id)
	const recipientSocket =
		author.id === creator.id
			? getUserSocket(recipient.id)
			: getUserSocket(creator.id)

	console.log(
		'recipientSocket',
		(recipientSocket?.request as IncomingMessageWithPassport).user
	)

	console.log(
		'authorSocket',
		(authorSocket?.request as IncomingMessageWithPassport).user
	)

	recipientSocket?.emit('onMessage', data)
	authorSocket?.emit('onMessage', data)
})

const sessions: Map<number, AuthenticatedSocket> = new Map()

function getUserSocket(id: number): AuthenticatedSocket | undefined {
	return sessions.get(id)
}

function setUserSocket(userId: number, socket: AuthenticatedSocket): void {
	sessions.set(userId, socket)
}

function removeUserSocket(userId: number): void {
	sessions.delete(userId)
}

function getSockets(): Map<number, AuthenticatedSocket> {
	return sessions
}

export const SocketSessionManager = {
	getUserSocket,
	setUserSocket,
	removeUserSocket,
	getSockets,
}
