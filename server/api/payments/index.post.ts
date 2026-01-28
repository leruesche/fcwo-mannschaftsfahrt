import type { PaymentsStateResponse } from '~/types/payment'
import { getPrismaClient } from '../../utils/prisma'
import { validatePaymentsStateDto } from '../../utils/validation'

export default defineEventHandler(async (event): Promise<PaymentsStateResponse> => {
  try {
    const body = await readBody(event)
    const state = validatePaymentsStateDto(body)

    const prisma = await getPrismaClient()

    // Start a transaction to replace all payments
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing payments
      await tx.payment.deleteMany({})

      // Create new payments from the state
      if (state.persons.length > 0) {
        await tx.payment.createMany({
          data: state.persons.map(person => ({
            name: person.name,
            paidAmount: person.paidAmount,
            totalAmountPerPerson: state.totalAmount,
          })),
        })
      }

      // Fetch the created payments to get timestamps
      const createdPayments = await tx.payment.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })

      return createdPayments
    })

    const lastSaved = result.length > 0
      ? result.reduce((latest, payment) => {
          return payment.updatedAt > latest ? payment.updatedAt : latest
        }, result[0].updatedAt).toISOString()
      : new Date().toISOString()

    return {
      totalAmount: state.totalAmount,
      persons: result.map(p => ({
        name: p.name,
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
