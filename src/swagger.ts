import swaggerAutogen from 'swagger-autogen'

// Определяем объект документации
const doc = {
	info: {
		version: '1.0.0',
		title: 'Aonarro Chat App',
		description: 'API documentation for the chat app',
	},
	servers: [
		{
			url: 'http://localhost:8000',
		},
	],
	components: {
		schemas: {
			CreateUserCredentials: {
				type: 'object',
				properties: {
					email: {
						type: 'string',
						format: 'email',
						example: 'johndoe@example.com',
					},
					firstName: {
						type: 'string',
						example: 'John',
					},
					lastName: {
						type: 'string',
						example: 'Doe',
					},
					password: {
						type: 'string',
						example: 'mypassword',
					},
				},
				required: ['email', 'firstName', 'lastName', 'password'],
			},
			LoginUserCredentials: {
				type: 'object',
				properties: {
					email: {
						type: 'string',
						format: 'email',
						example: 'johndoe@example.com',
					},
					password: {
						type: 'string',
						example: 'mypassword',
					},
				},
				required: ['email', 'password'],
			},
		},
	},
	securitySchemes: {
		sessionAuth: {
			type: 'http',
			scheme: 'basic',
		},
	},
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/index.ts']

// Генерируем документацию
swaggerAutogen({ openapi: '3.0.0', autoquery: 'false', autobody: 'false' })(
	outputFile,
	endpointsFiles,
	doc
)
