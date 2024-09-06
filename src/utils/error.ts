export class HttpException extends Error {
	statusCode: number
	errors?: Array<{ msg: string; path?: string }>

	constructor(
		errors: Array<{ msg: string; path?: string }> | string = [],
		statusCode: number
	) {
		super('Validation error')
		this.statusCode = statusCode

		if (typeof errors === 'string') {
			this.errors = [{ msg: errors }]
		} else {
			this.errors = errors.map(error => ({
				msg: error.msg || 'Internal error',
				field: error.path,
			}))
		}
	}
}
