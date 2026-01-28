export type PaymentStatus = 'not-paid' | 'paid' | 'partial' | 'overpaid'

export interface Payment {
  id: number
  name: string
  paidAmount: number
  remainingAmount: number
  status: PaymentStatus
}

export interface PersonData {
  id: number
  name: string
  paidAmount: number
}

// Database model types (aligned with Prisma schema)
export interface PaymentRecord {
  id: string
  name: string
  paidAmount: number
  totalAmountPerPerson: number
  createdAt: Date
  updatedAt: Date
}

// DTOs for API communication
export interface PaymentCreateDto {
  name: string
  paidAmount: number
  totalAmountPerPerson: number
}

export interface PaymentUpdateDto {
  name?: string
  paidAmount?: number
  totalAmountPerPerson?: number
}

export interface PaymentResponse {
  id: string
  name: string
  paidAmount: number
  totalAmountPerPerson: number
  createdAt: string
  updatedAt: string
}

export interface PaymentsStateDto {
  totalAmount: number
  persons: Array<{
    name: string
    paidAmount: number
  }>
}

export interface PaymentsStateResponse {
  totalAmount: number
  persons: Array<{
    name: string
    paidAmount: number
  }>
  lastSaved: string | null
}
