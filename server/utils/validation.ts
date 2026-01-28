import type { PaymentCreateDto, PaymentsStateDto } from '~/types/payment'

export function validatePaymentCreateDto(data: unknown): PaymentCreateDto {
  if (!data || typeof data !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  const dto = data as Record<string, unknown>

  if (typeof dto.name !== 'string' || dto.name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required and must be a non-empty string',
    })
  }

  const paidAmount = typeof dto.paidAmount === 'number'
    ? dto.paidAmount
    : typeof dto.paidAmount === 'string'
      ? Number.parseFloat(dto.paidAmount)
      : 0

  if (Number.isNaN(paidAmount) || paidAmount < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'paidAmount must be a valid non-negative number',
    })
  }

  const totalAmountPerPerson = typeof dto.totalAmountPerPerson === 'number'
    ? dto.totalAmountPerPerson
    : typeof dto.totalAmountPerPerson === 'string'
      ? Number.parseFloat(dto.totalAmountPerPerson)
      : 0

  if (Number.isNaN(totalAmountPerPerson) || totalAmountPerPerson < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'totalAmountPerPerson must be a valid non-negative number',
    })
  }

  return {
    name: dto.name.trim(),
    paidAmount,
    totalAmountPerPerson,
  }
}

export function validatePaymentsStateDto(data: unknown): PaymentsStateDto {
  if (!data || typeof data !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  const dto = data as Record<string, unknown>

  const totalAmount = typeof dto.totalAmount === 'number'
    ? dto.totalAmount
    : typeof dto.totalAmount === 'string'
      ? Number.parseFloat(dto.totalAmount)
      : 0

  if (Number.isNaN(totalAmount) || totalAmount < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'totalAmount must be a valid non-negative number',
    })
  }

  if (!Array.isArray(dto.persons)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'persons must be an array',
    })
  }

  const persons = dto.persons.map((p: unknown) => {
    if (!p || typeof p !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Each person must be an object',
      })
    }

    const person = p as Record<string, unknown>
    const name = typeof person.name === 'string' ? person.name.trim() : ''
    const paidAmount = typeof person.paidAmount === 'number'
      ? person.paidAmount
      : typeof person.paidAmount === 'string'
        ? Number.parseFloat(person.paidAmount)
        : 0

    if (Number.isNaN(paidAmount) || paidAmount < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Each person\'s paidAmount must be a valid non-negative number',
      })
    }

    return {
      name,
      paidAmount,
    }
  })

  return {
    totalAmount,
    persons,
  }
}
