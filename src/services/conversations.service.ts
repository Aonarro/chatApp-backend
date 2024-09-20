import { Participant, PrismaClient, User } from '@prisma/client'
import { CreateConversationParams } from '../types/conversations'
import { createParticipant } from './participants.service'
import { findUser, saveUser } from './users.service'

const prisma = new PrismaClient()

export const createConversationByParams = async (
	id: number,
	params: CreateConversationParams
) => {
	const { recipientId, authorId } = params
	const participants: Participant[] = []

	const userDB = await findUser({ id: +authorId }, { includePassword: false })

	if (!userDB) {
		throw new Error('Cannot create conversation')
	}

	if (!userDB.participant) {
		const participant = await createParticipantAndSaveUser(userDB, authorId)
		participants.push(participant)
		console.log(participants)
	} else {
		participants.push(userDB.participant)
		console.log(participants)
	}

	const recipient = await findUser(
		{
			id: +recipientId,
		},
		{ includePassword: false }
	)

	if (!recipient) {
		throw new Error('Cannot create conversation')
	}
	if (!recipient.participant) {
		const participant = await createParticipantAndSaveUser(
			recipient,
			recipientId
		)
		participants.push(participant)
	} else {
		participants.push(recipient.participant)
	}

	const existingConversationWithParticipants =
		await prisma.conversation.findFirst({
			where: {
				AND: [
					{
						participants: {
							some: { userId: +authorId },
						},
					},
					{
						participants: {
							some: { userId: +recipientId },
						},
					},
				],
			},
			include: {
				participants: true,
			},
		})

	if (!existingConversationWithParticipants) {
		const newConversation = await prisma.conversation
			.create({
				data: {
					participants: {
						connect: participants.map((item) => ({ id: item.id })),
					},
				},
			})
			.then(() =>
				prisma.conversation.findFirst({
					where: {
						AND: [
							{
								participants: {
									some: { userId: +authorId },
								},
							},
							{
								participants: {
									some: { userId: +recipientId },
								},
							},
						],
					},
					include: {
						participants: true,
					},
				})
			)

		return newConversation
	}

	return existingConversationWithParticipants
}

const createParticipantAndSaveUser = async (user: User, id: number) => {
	const participant = await createParticipant({
		id: id,
		userId: user.id,
	})
	user.participantId = participant.id
	await saveUser(user)
	return participant
}
