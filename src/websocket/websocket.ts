import { PrismaClient } from '@prisma/client'
import EventEmitter from 'events'
import { Server as HttpServer, IncomingMessage } from 'http'
import passport from 'passport'
import { Server, Socket } from 'socket.io'
import { sessionMiddleware } from '..'
import { wrap } from '../middlewares/websocketSessionMiddleware'
import { Conversation } from '../types/conversations'
import { CreateMessageResponse, DeleteMessageResponse } from '../types/message'
import { AuthenticatedSocket } from '../types/websocketSessions'

export type IncomingMessageWithPassport = IncomingMessage & {
	isAuthenticated: () => boolean
	user?: any
}

const prisma = new PrismaClient()

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

		console.log('authenicated socket')

		if (req.isAuthenticated()) {
			return next()
		}

		return next(new Error('Unauthorized1234'))
	})

	////////////////////////////////////////////////////////////////////////////////////////
	io.on('connection', (socket: Socket) => {
		const req = socket.request as IncomingMessageWithPassport
		socket.emit('Connected to the chat', { status: 'good' })

		setUserSocket(req.user.id, socket)

		socket.on('onClientConnect', (data) => {
			console.log('Client connected')
			console.log(data)
		})

		socket.on('onConversationJoin', (data) => {
			console.log(
				`${req?.user.id} joined a Conversation of ID: ${data.conversationId}`
			)
			socket.join(data.conversationId)
			console.log(socket.rooms)
			socket.to(data.conversationId).emit('userJoin')
		})

		socket.on('onConversationLeave', (data) => {
			console.log(
				`${req?.user.id} leave a Conversation of ID: ${data.conversationId}`
			)
			socket.leave(data.conversationId)
			console.log(socket.rooms)
			socket.to(data.conversationId).emit('userLeave')
		})

		socket.on('onTypingStart', (data) => {
			console.log(`начал печатать...`)
			console.log(data)
			socket.to(data.conversationId).emit('onTypingStart')
		})

		socket.on('onTypingStop', (data) => {
			console.log(`перестал печатать...`)
			console.log(data)
			socket.to(data.conversationId).emit('onTypingStop')
		})
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

	if (authorSocket) authorSocket?.emit('onMessage', data)
	if (recipientSocket) recipientSocket?.emit('onMessage', data)
})

eventEmitter.on('deleteMessage', async (payload: DeleteMessageResponse) => {
	const conversationMembers = await prisma.conversation.findFirst({
		where: { id: +payload.conversationId },
		include: {
			creator: true,
			recipient: true,
		},
	})

	if (!conversationMembers) return

	const { creator, recipient } = conversationMembers

	const recipientSocket =
		creator.id === payload.userId
			? getUserSocket(recipient.id)
			: getUserSocket(creator.id)

	const { userId, ...rest } = payload

	if (recipientSocket) recipientSocket.emit('onMessageDelete', { ...rest })
})

eventEmitter.on('createConversation', (payload: Conversation) => {
	const recipientSocket = getUserSocket(payload.recipient.id)

	if (recipientSocket) recipientSocket.emit('onNewConversation', payload)
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
