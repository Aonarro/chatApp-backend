export type CreateUserCredentials = {
	email: string
	firstName: string
	lastName: string
	password: string
}

export type LoginUserCredentials = {
	email: string
	password: string
}

export type ValidateUserDetails = {
	email: string
	password: string
}

export type FindUserParams = Partial<{
	id: number
	email: string
	username: string
}>

export type FindUserOptions = Partial<{
	includePassword: boolean
}>
