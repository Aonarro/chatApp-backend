import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import http from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import router from './routes'
import './utils/mongo'
import { initializeSocket } from './websocket/websocket'

dotenv.config()

const app: Application = express()
const port = process.env.EXPRESS_PORT || 5000
const httpServer = http.createServer(app)

// Middleware setup
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))
app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:8000'],
		credentials: true,
	})
)

export const sessionMiddleware = session({
	secret: process.env.COOKIE_SECRET || 'secret-cookie-word',
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		client: mongoose.connection.getClient(),
		autoRemove: 'interval',
		autoRemoveInterval: 10,
	}),
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 60 * 24,
		httpOnly: true,
		sameSite: 'lax',
	},
})
//3600000 * 24
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

// Routes setup
app.use(router)

initializeSocket(httpServer)

httpServer.listen(port, () => {
	console.log('listening on port ' + port)
})
