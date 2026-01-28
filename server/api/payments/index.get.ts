import type { PaymentsStateResponse } from '~/types/payment'
import { getPrismaClient } from '../../utils/prisma'

export default defineEventHandler(async (event): Promise<PaymentsStateResponse> => {
  try {
    const prisma = await getPrismaClient()

    // Get all payments from database
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (payments.length === 0) {
      return {
        totalAmount: 0,
        persons: [],
        lastSaved: null,
      }
    }

    // Group by totalAmountPerPerson to determine the current totalAmount
    // We assume all payments should have the same totalAmountPerPerson
    const totalAmount = payments[0]?.totalAmountPerPerson || 0

    // Convert payments to persons format
    const persons = payments.map(payment => ({
      name: payment.name,
      paidAmount: payment.paidAmount,
    }))

    // Get the most recent updatedAt as lastSaved
    const lastSaved = payments.length > 0
      ? payments.reduce((latest, payment) => {
          return payment.updatedAt > latest ? payment.updatedAt : latest
        }, payments[0].updatedAt).toISOString()
      : null

    return {
      totalAmount,
      persons,
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
