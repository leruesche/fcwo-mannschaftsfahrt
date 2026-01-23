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
