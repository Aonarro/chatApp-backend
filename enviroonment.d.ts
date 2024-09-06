declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL?: string
		COOKIE_SECRET?: string
		EXPRESS_PORT?: string
	}
}
