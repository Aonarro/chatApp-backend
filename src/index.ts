import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import helmet from 'helmet'
import { errorMiddleware } from './middlewares/errorMiddleware'
import router from './routes'

dotenv.config()

const app: Application = express()
const port = process.env.EXPRESS_PORT || 5000

// Middleware setup
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(cors())

// Routes setup
app.use(router)

app.use(errorMiddleware)

app.listen(port, () => {
	console.log('listening on port ' + port)
})
