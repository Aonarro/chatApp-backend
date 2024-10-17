import 'http'
import { User } from 'passport'
declare namespace NodeJS {
	export interface ProcessEnv {
		MYSQL_DB_HOST? = string
		MYSQL_DB_USERNAME? = string
		MYSQL_DB_PASSWORD? = number
		MYSQL_DB_PORT? = number
		MYSQL_DB_NAME? = string
		DATABASE_URL?: string
		COOKIE_SECRET?: string
		EXPRESS_PORT?: string
	}
}

declare global {
	export namespace Express {
		export interface User {
			id: number
		}
	}
}

declare module 'node:http' {
	interface IncomingMessage {
		user: User
		isAuthenticated: () => boolean
	}
}
