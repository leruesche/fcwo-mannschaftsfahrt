import type { PaymentsStateDto, PaymentsStateResponse } from '~/types/payment'
import { prisma } from '#server/utils/db'

export default defineEventHandler(async (event): Promise<PaymentsStateResponse> => {
  try {
    const body = await readBody<PaymentsStateDto>(event)

    // Validate input
    if (typeof body.totalAmount !== 'number' || !Array.isArray(body.participants)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body',
      })
    }

    // Start a transaction to replace all data
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing payments first (due to foreign key constraint)
      await tx.payment.deleteMany({})

      // Delete all existing participants
      await tx.participant.deleteMany({})

      // Create participants and payments
      const createdPayments = []

      for (const participant of body.participants) {
        // Create participant
        const createdParticipant = await tx.participant.create({
          data: {
            name: participant.name,
          },
        })

        // Create payment for this participant
        const payment = await tx.payment.create({
          data: {
            paidAmount: participant.paidAmount,
            totalAmount: body.totalAmount,
            participantId: createdParticipant.id,
          },
          include: {
            participant: true,
          },
        })

        createdPayments.push(payment)
      }

      return createdPayments
    })

    const lastSaved = result.length > 0
      ? result.reduce((latest, payment) => {
          return payment.updatedAt > latest ? payment.updatedAt : latest
        }, result[0]!.updatedAt).toISOString()
      : new Date().toISOString()

    return {
      totalAmount: body.totalAmount,
      participants: result.map(p => ({
        name: p.participant.name,
        paidAmount: p.paidAmount,
      })),
      lastSaved,
    }
  }
  catch (error) {
    console.error('Error saving payments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save payments',
    })
  }
})
