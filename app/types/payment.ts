// =============================================================================
// Payment Status
// =============================================================================
export type PaymentStatus = 'not-paid' | 'paid' | 'partial' | 'overpaid'

// =============================================================================
// Database Models (aligned with Prisma schema)
// =============================================================================
export interface Participant {
  id: string
  name: string
  email: string | null
  createdAt: Date
  updatedAt: Date
  payment?: Payment | null
}

export interface Payment {
  id: string
  paidAmount: number
  totalAmount: number
  participantId: string
  createdAt: Date
  updatedAt: Date
  participant?: Participant
}

export interface ParticipantWithPayment extends Participant {
  payment: Payment
}

// =============================================================================
// Frontend Display Types
// =============================================================================
export interface ParticipantDisplay {
  id: number // Local index for Vue rendering
  name: string
  paidAmount: number
  remainingAmount: number
  status: PaymentStatus
}

// =============================================================================
// DTOs for API Communication
// =============================================================================
export interface ParticipantCreateDto {
  name: string
  email?: string
  paidAmount?: number
}

export interface ParticipantUpdateDto {
  name?: string
  email?: string
  paidAmount?: number
}

export interface PaymentsStateDto {
  totalAmount: number
  participants: Array<{
    name: string
    paidAmount: number
  }>
}

export interface PaymentsStateResponse {
  totalAmount: number
  participants: Array<{
    name: string
    paidAmount: number
  }>
  lastSaved: string | null
}
