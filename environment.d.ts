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

declare module 'http' {
	interface IncomingMessage {
		user?: User // Свойство user, добавляемое Passport.js
		isAuthenticated?: () => boolean // Метод isAuthenticated, который добавляет Passport.js
	}
}
