import { DefaultEventsMap, Socket } from 'socket.io'

export interface AuthenticatedSocket
	extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
	user?: {
		id: number
	}
}
