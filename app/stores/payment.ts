import type { ParticipantDisplay, PaymentsStateDto, PaymentsStateResponse } from '~/types/payment'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface ParticipantData {
  id: number
  name: string
  paidAmount: number
}

export const usePaymentStore = defineStore('payment', () => {
  // State
  const totalAmount = ref(0)
  const participants = ref<ParticipantData[]>([])
  const lastSaved = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const participantCount = computed(() => {
    return participants.value.filter(p => p.name.trim() !== '').length
  })

  const totalPaid = computed(() => {
    return participants.value.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
  })

  const expectedTotal = computed(() => {
    const count = participants.value.filter(p => p.name.trim() !== '').length
    return totalAmount.value * count
  })

  const pendingAmount = computed(() => {
    const count = participants.value.filter(p => p.name.trim() !== '').length
    const paid = participants.value.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
    return (totalAmount.value * count) - paid
  })

  const getParticipantRemaining = (participantId: number) => {
    const participant = participants.value.find(p => p.id === participantId)
    if (!participant)
      return 0
    return totalAmount.value - (participant.paidAmount || 0)
  }

  const getParticipantStatus = (participantId: number): 'not-paid' | 'paid' | 'partial' | 'overpaid' => {
    const participant = participants.value.find(p => p.id === participantId)
    if (!participant)
      return 'not-paid'

    const paid = participant.paidAmount || 0
    const remaining = totalAmount.value - paid

    if (paid === 0)
      return 'not-paid'
    if (remaining === 0)
      return 'paid'
    if (remaining > 0)
      return 'partial'
    return 'overpaid'
  }

  async function save() {
    isLoading.value = true
    error.value = null

    try {
      const state: PaymentsStateDto = {
        totalAmount: totalAmount.value,
        participants: participants.value.map(p => ({
          name: p.name,
          paidAmount: p.paidAmount,
        })),
      }

      const response = await $fetch<PaymentsStateResponse>('/api/payments', {
        method: 'POST',
        body: state,
      })

      lastSaved.value = response.lastSaved || new Date().toISOString()
    }
    catch (err) {
      error.value = 'Fehler beim Speichern der Daten'
      console.error('Fehler beim Speichern:', err)
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  async function setTotalAmount(amount: number) {
    totalAmount.value = amount
    await save()
  }

  async function addParticipant(name = '', paidAmount = 0) {
    const newId = participants.value.length > 0
      ? Math.max(...participants.value.map(p => p.id)) + 1
      : 0

    participants.value.push({
      id: newId,
      name,
      paidAmount,
    })

    await save()
  }

  async function removeParticipant(participantId: number) {
    participants.value = participants.value.filter(p => p.id !== participantId)
    await save()
  }

  async function updateParticipant(participantId: number, updates: Partial<ParticipantData>) {
    const participant = participants.value.find(p => p.id === participantId)
    if (participant) {
      Object.assign(participant, updates)
      await save()
    }
  }

  function exportToJSON() {
    const data = {
      totalAmount: totalAmount.value,
      participants: participants.value.map(p => ({
        name: p.name,
        paidAmount: p.paidAmount,
        remainingAmount: totalAmount.value - p.paidAmount,
        status: getParticipantStatus(p.id),
      })),
      exportedAt: new Date().toISOString(),
      version: '2.0',
    }
    return JSON.stringify(data, null, 2)
  }

  function exportToCSV() {
    let csv = 'Name,Gezahlter Betrag (€),Restbetrag (€),Status\n'

    participants.value.forEach((participant) => {
      const remaining = (totalAmount.value - participant.paidAmount).toFixed(2)
      const status = getParticipantStatus(participant.id)
      let statusText = ''

      switch (status) {
        case 'not-paid':
          statusText = 'Nicht gezahlt'
          break
        case 'paid':
          statusText = '✓ Vollständig gezahlt'
          break
        case 'partial':
          statusText = 'Teilweise gezahlt'
          break
        case 'overpaid':
          statusText = 'Überzahlung'
          break
      }

      csv += `"${participant.name}",${participant.paidAmount},${remaining},"${statusText}"\n`
    })

    csv += `\nGesamtbetrag pro Teilnehmer,${totalAmount.value}\n`
    return csv
  }

  async function importFromJSON(jsonData: string) {
    try {
      const data = JSON.parse(jsonData)

      if (data.totalAmount) {
        totalAmount.value = Number.parseFloat(data.totalAmount) || 0
      }

      // Support both old "persons" and new "participants" format
      const rawParticipants = data.participants || data.persons || []
      participants.value = rawParticipants.map((p: any, index: number) => ({
        id: index,
        name: p.name || '',
        paidAmount: Number.parseFloat(p.paidAmount) || 0,
      }))

      await save()
      return true
    }
    catch (err) {
      console.error('Import-Fehler:', err)
      return false
    }
  }

  function getParticipantDisplay(participantId: number): ParticipantDisplay | null {
    const participant = participants.value.find(p => p.id === participantId)
    if (!participant)
      return null

    return {
      id: participant.id,
      name: participant.name,
      paidAmount: participant.paidAmount,
      remainingAmount: totalAmount.value - participant.paidAmount,
      status: getParticipantStatus(participant.id),
    }
  }

  return {
    // State
    totalAmount,
    participants,
    lastSaved,
    isLoading,
    error,
    // Getters
    participantCount,
    totalPaid,
    expectedTotal,
    pendingAmount,
    getParticipantRemaining,
    getParticipantStatus,
    getParticipantDisplay,
    // Actions
    save,
    setTotalAmount,
    addParticipant,
    removeParticipant,
    updateParticipant,
    exportToJSON,
    exportToCSV,
    importFromJSON,
  }
})
