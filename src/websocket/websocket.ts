import EventEmitter from 'events'
import { Server as HttpServer, IncomingMessage } from 'http'
import passport from 'passport'
import { Server, Socket } from 'socket.io'
import { sessionMiddleware } from '..'
import { wrap } from '../middlewares/websocketSessionMiddleware'

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
		const req = socket.request as IncomingMessage & {
			isAuthenticated: () => boolean
			user?: any
		}

		console.log(
			'1321y732167831728637821678361276378216312737261736128',
			req.isAuthenticated()
		)

		if (req.isAuthenticated()) {
			return next()
		}

		return next(new Error('Unauthorized1234'))
	})

	// io.engine.use(onlyForHandshake(sessionMiddleware))
	// io.engine.use(onlyForHandshake(onlyForHandshake(passport.session)))
	// io.engine.use(
	// 	onlyForHandshake((req: Request, res: Response, next: NextFunction) => {
	// 		console.log('USER', req.user)

	// 		if (req.user) {
	// 			next()
	// 		} else {
	// 			res.writeHead(401)
	// 			res.end()
	// 		}
	// 	})
	// )

	// io.use(async (socket: Socket, next) => {
	// 	const { cookie: clientCookie } = socket.handshake.headers
	// 	if (!clientCookie) {
	// 		console.log('Client has no cookies')
	// 		return next(new Error('Not Authenticated. No cookies were sent'))
	// 	}

	// 	const parsedCookies = cookie.parse(clientCookie)
	// 	const connect_sid = parsedCookies['connect.sid'] // Извлекаем connect.sid

	// 	if (!connect_sid) {
	// 		console.log('connect.sid не существует')
	// 		return next(new Error('Не аутентифицирован. ID сессии не найден.'))
	// 	}

	// 	const signedSessionCookie = cookieParser.signedCookie(
	// 		connect_sid,
	// 		process.env.COOKIE_SECRET as string
	// 	)
	// 	console.log('signed cookie  ', signedSessionCookie)

	// 	// console.log(socket.request)

	// 	try {
	// 		const sessionCollection = mongoose.connection.collection('sessions')
	// 		// const sessionData = await sessionCollection.findOne({
	// 		// 	_id: signedSessionCookie,
	// 		// })

	// 		if (typeof signedSessionCookie === 'string') {
	// 			const sessionData = await sessionCollection.findOne({
	// 				_id: new mongoose.Types.ObjectId(signedSessionCookie),
	// 			})
	// 			console.log('SESSION DATA', sessionData)
	// 		}
	// 	} catch (error) {
	// 		console.log(error)
	// 	}

	// 	// if (!signedCookie) return next(new Error('Error signing cookie'))

	// 	// const sessionRepository = getRepository(Session)
	// 	// const sessionDB = await sessionRepository.findOne({ id: signedCookie })

	// 	// if (!sessionDB) return next(new Error('No session found'))

	// 	// const userFromJson = JSON.parse(sessionDB.json)
	// 	// if (!userFromJson.passport || !userFromJson.passport.user) {
	// 	// 	return next(new Error('Passport or User object does not exist.'))
	// 	// }

	// 	// const userDB = plainToInstance(User, userFromJson.passport.user)
	// 	// socket.user = userDB // Добавляем пользователя в сокет
	// 	next()
	// })
	////////////////////////////////////////////////////////////////////////////////////////
	io.on('connection', (socket: Socket) => {
		const req = socket.request as any
		console.log('A user connected:', req.user)
		socket.emit('Connected to the chat', { status: 'good' })

		eventEmitter.on('createMessage', (data) => {
			console.log('User created event received', data)

			socket.emit('onMessage', data)
		})
	})
}

// const sessions: Map<number, AuthenticatedSocket> = new Map()

// function getUserSocket(id: number): AuthenticatedSocket | undefined {
// 	return sessions.get(id)
// }

// function setUserSocket(userId: number, socket: AuthenticatedSocket): void {
// 	sessions.set(userId, socket)
// }

// function removeUserSocket(userId: number): void {
// 	sessions.delete(userId)
// }

// function getSockets(): Map<number, AuthenticatedSocket> {
// 	return sessions
// }

// export const SocketSessionManager = {
// 	getUserSocket,
// 	setUserSocket,
// 	removeUserSocket,
// 	getSockets,
// }
