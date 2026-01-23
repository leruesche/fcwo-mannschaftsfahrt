import type { PersonData } from '~/types/payment'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'mannschaftsfahrt_zahlungen'

export const usePaymentStore = defineStore('payment', () => {
  // State
  const totalAmount = ref(0)
  const persons = ref<PersonData[]>([])
  const lastSaved = ref<string | null>(null)

  // Getters
  const personCount = computed(() => {
    return persons.value.filter(p => p.name.trim() !== '').length
  })

  const totalPaid = computed(() => {
    return persons.value.reduce((sum, person) => sum + (person.paidAmount || 0), 0)
  })

  const expectedTotal = computed(() => {
    const count = persons.value.filter(p => p.name.trim() !== '').length
    return totalAmount.value * count
  })

  const pendingAmount = computed(() => {
    const count = persons.value.filter(p => p.name.trim() !== '').length
    const paid = persons.value.reduce((sum, person) => sum + (person.paidAmount || 0), 0)
    return (totalAmount.value * count) - paid
  })

  const getPersonRemaining = (personId: number) => {
    const person = persons.value.find(p => p.id === personId)
    if (!person)
      return 0
    return totalAmount.value - (person.paidAmount || 0)
  }

  const getPersonStatus = (personId: number): 'not-paid' | 'paid' | 'partial' | 'overpaid' => {
    const person = persons.value.find(p => p.id === personId)
    if (!person)
      return 'not-paid'

    const paid = person.paidAmount || 0
    const remaining = totalAmount.value - paid

    if (paid === 0)
      return 'not-paid'
    if (remaining === 0)
      return 'paid'
    if (remaining > 0)
      return 'partial'
    return 'overpaid'
  }

  // Actions
  function loadFromStorage() {
    if (typeof window === 'undefined')
      return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        totalAmount.value = Number.parseFloat(data.totalAmount) || 0
        const loadedPersons = (data.persons || []).map((p: any, index: number) => ({
          id: index,
          name: p.name || '',
          paidAmount: Number.parseFloat(p.paidAmount) || 0,
        }))
        persons.value = loadedPersons.length > 0 ? loadedPersons : []
        lastSaved.value = data.lastSaved || null
      }
    }
    catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    }
  }

  function saveToStorage() {
    if (typeof window === 'undefined')
      return

    try {
      const data = {
        totalAmount: totalAmount.value.toString(),
        persons: persons.value.map(p => ({
          name: p.name,
          paidAmount: p.paidAmount.toString(),
        })),
        lastSaved: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      lastSaved.value = data.lastSaved
    }
    catch (error) {
      console.error('Fehler beim Speichern der Daten:', error)
    }
  }

  function setTotalAmount(amount: number) {
    totalAmount.value = amount
    saveToStorage()
  }

  function addPlayer(name = '', paidAmount = 0) {
    const newId = persons.value.length > 0
      ? Math.max(...persons.value.map(p => p.id)) + 1
      : 0

    persons.value.push({
      id: newId,
      name,
      paidAmount,
    })
    saveToStorage()
  }

  function removePerson(personId: number) {
    persons.value = persons.value.filter(p => p.id !== personId)
    saveToStorage()
  }

  function updatePerson(personId: number, updates: Partial<PersonData>) {
    const person = persons.value.find(p => p.id === personId)
    if (person) {
      Object.assign(person, updates)
      saveToStorage()
    }
  }

  function exportToJSON() {
    const data = {
      totalAmount: totalAmount.value.toString(),
      persons: persons.value.map(p => ({
        name: p.name,
        paidAmount: p.paidAmount.toString(),
        remainingAmount: (totalAmount.value - p.paidAmount).toFixed(2),
        status: getPersonStatus(p.id),
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
    return JSON.stringify(data, null, 2)
  }

  function exportToCSV() {
    let csv = 'Name,Gezahlter Betrag (€),Restbetrag (€),Status\n'

    persons.value.forEach((person) => {
      const remaining = (totalAmount.value - person.paidAmount).toFixed(2)
      const status = getPersonStatus(person.id)
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

      csv += `"${person.name}",${person.paidAmount},${remaining},"${statusText}"\n`
    })

    csv += `\nGesamtbetrag pro Spieler,${totalAmount.value}\n`
    return csv
  }

  function importFromJSON(jsonData: string) {
    try {
      const data = JSON.parse(jsonData)

      if (data.totalAmount) {
        totalAmount.value = Number.parseFloat(data.totalAmount) || 0
      }

      persons.value = []
      if (data.persons && data.persons.length > 0) {
        data.persons.forEach((p: any, index: number) => {
          persons.value.push({
            id: index,
            name: p.name || '',
            paidAmount: Number.parseFloat(p.paidAmount) || 0,
          })
        })
      }

      saveToStorage()
      return true
    }
    catch (error) {
      console.error('Import-Fehler:', error)
      return false
    }
  }

  return {
    // State
    totalAmount,
    persons,
    lastSaved,
    // Getters
    personCount,
    totalPaid,
    expectedTotal,
    pendingAmount,
    getPersonRemaining,
    getPersonStatus,
    // Actions
    loadFromStorage,
    saveToStorage,
    setTotalAmount,
    addPlayer,
    removePerson,
    updatePerson,
    exportToJSON,
    exportToCSV,
    importFromJSON,
  }
})
