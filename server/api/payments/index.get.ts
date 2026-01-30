import type { PaymentsStateResponse } from '~/types/payment'
import { prisma } from '#server/utils/db'

export default defineEventHandler(async (): Promise<PaymentsStateResponse> => {
  try {
    // Get all payments with participant data
    const payments = await prisma.payment.findMany({
      include: {
        participant: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (payments.length === 0) {
      return {
        totalAmount: 0,
        participants: [],
        lastSaved: null,
      }
    }

    // Get totalAmount from first payment (all should have the same)
    const totalAmount = payments[0]?.totalAmount || 0

    // Convert payments to participants format
    const participants = payments.map(payment => ({
      name: payment.participant.name,
      paidAmount: payment.paidAmount,
    }))

    // Get the most recent updatedAt as lastSaved
    const lastSaved = payments.reduce((latest, payment) => {
      return payment.updatedAt > latest ? payment.updatedAt : latest
    }, payments[0]!.updatedAt).toISOString()

    return {
      totalAmount,
      participants,
      lastSaved,
    }
  }
  catch (error) {
    console.error('Error fetching payments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch payments',
    })
  }
})
