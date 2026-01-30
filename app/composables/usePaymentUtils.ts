import type { PaymentStatus } from '@/types/payment'

export function usePaymentUtils() {
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  function getStatusText(status: PaymentStatus): string {
    const statusMap: Record<PaymentStatus, string> = {
      'not-paid': 'Nicht gezahlt',
      'paid': '✓ Vollständig gezahlt',
      'partial': 'Teilweise gezahlt',
      'overpaid': 'Überzahlung',
    }
    return statusMap[status] || '-'
  }

  function getStatusColor(status: PaymentStatus): 'success' | 'warning' | 'error' | 'neutral' {
    const colorMap: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
      'not-paid': 'warning',
      'paid': 'success',
      'partial': 'warning',
      'overpaid': 'error',
    }
    return colorMap[status] || 'neutral'
  }

  return {
    formatCurrency,
    getStatusText,
    getStatusColor,
  }
}
