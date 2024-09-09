import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import router from './routes'
import './utils/mongo'

dotenv.config()

const app: Application = express()
const port = process.env.EXPRESS_PORT || 5000

// Middleware setup
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(
	session({
		secret: process.env.COOKIE_SECRET || 'secret-cookie-word',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			client: mongoose.connection.getClient(),
		}),
		cookie: { secure: false, maxAge: 3600000 * 24, httpOnly: true },
	})
)

app.use(passport.initialize())
app.use(passport.session())

// Routes setup
app.use(router)

app.listen(port, () => {
	console.log('listening on port ' + port)
})
