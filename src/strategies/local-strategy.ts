import { User } from '@prisma/client'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { validateUser } from '../services/auth.service'
import { findUser } from '../services/users.service'

// Определяем типы
type UserWithoutPassword = Omit<User, 'password'>

passport.serializeUser(
	(user: Express.User, done: (err: any, id?: number) => void) => {
		done(null, (user as UserWithoutPassword).id)
	}
)

passport.deserializeUser(
	async (
		id: number,
		done: (err: any, user?: UserWithoutPassword | null) => void
	) => {
		try {
			const user = await findUser({ id }, { includePassword: false })
			done(null, user || null)
		} catch (error) {
			done(error, null)
		}
	}
)

passport.use(
	new LocalStrategy(
		{ usernameField: 'email' },
		async (
			email: string,
			password: string,
			done: (
				err: any,
				user?: UserWithoutPassword | false,
				info?: { message: string }
			) => void
		) => {
			try {
				const validUser = await validateUser({ password, email })
				console.log(validUser)

				return done(null, validUser)
			} catch (error) {
				return done(error, false)
			}
		}
	)
)
