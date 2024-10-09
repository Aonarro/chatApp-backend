// export function onlyForHandshake(middleware: any) {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		const isHandshake =
// 			(req as any)._query && (req as any)._query.sid === undefined
// 		if (isHandshake) {
// 			middleware(req, res, next)
// 		} else {
// 			next()
// 		}
// 	}
// }

export const wrap = (middleware: any) => (socket: any, next: any) =>
	middleware(socket.request, {}, next)
