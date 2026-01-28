<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row, TableMeta } from '@tanstack/vue-table'
import type { Payment, PersonData } from '~/types/payment'

// ============================================
// Composables & Store
// ============================================
const store = usePaymentStore()
const { formatCurrency, getStatusText, getStatusColor } = usePaymentUtils()
const { exportCSV, exportJSON, importJSON } = useFileExport()
const toast = useToast()

// ============================================
// Refs
// ============================================
const fileInput = ref<HTMLInputElement | null>(null)

// ============================================
// Lifecycle
// ============================================
onMounted(async () => {
  // First load from localStorage for immediate display
  store.loadFromStorage()

  // Then try to load from database (will fallback to localStorage on error)
  try {
    await store.loadFromDatabase()
  }
  catch (error) {
    console.warn('Could not load from database, using localStorage:', error)
  }

  nextTick(() => {
    if (store.persons.length === 0) {
      store.addPlayer('', 0)
    }
  })
})

// ============================================
// Computed Properties
// ============================================
const totalAmount = computed({
  get: () => store.totalAmount,
  set: value => store.setTotalAmount(value),
})

const paymentData = computed<Payment[]>(() => {
  if (!store.persons || store.persons.length === 0) {
    return []
  }

  return store.persons.map((person: PersonData) => ({
    id: person.id,
    name: person.name,
    paidAmount: person.paidAmount,
    remainingAmount: store.getPersonRemaining(person.id),
    status: store.getPersonStatus(person.id),
  }))
})

// ============================================
// Table Configuration
// ============================================
const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      class: {
        th: 'text-center font-semibold',
        td: 'text-center',
      },
    },
  },
  {
    accessorKey: 'paidAmount',
    header: 'Gezahlter Betrag (€)',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center',
      },
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center',
      },
    },
  },
  {
    accessorKey: 'remainingAmount',
    header: 'Restbetrag (€)',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right',
      },
    },
  },
  {
    accessorKey: 'actions',
    header: 'Aktion',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right',
      },
    },
  },
]

const tableMeta: TableMeta<Payment> = {
  class: {
    tr: (row: Row<Payment>) => {
      if (row.original.status === 'not-paid') {
        return 'bg-error/10'
      }
      if (row.original.status === 'partial') {
        return 'bg-warning/10'
      }
      if (row.original.status === 'paid' || row.original.status === 'overpaid') {
        return 'bg-success/10'
      }
      return ''
    },
  },
}

// ============================================
// Player Management
// ============================================
function addPlayer() {
  store.addPlayer('', 0)
  toast.add({
    title: 'Teilnehmer hinzugefügt',
    icon: 'i-lucide-check',
    color: 'success',
  })
}

function removePerson(personId: number) {
  store.removePerson(personId)
  toast.add({
    title: 'Teilnehmer entfernt',
    icon: 'i-lucide-check',
    color: 'success',
  })
}

function updatePersonName(personId: number, name: string) {
  store.updatePerson(personId, { name })
}

function updatePersonPaidAmount(personId: number, paidAmount: number | string) {
  const amount = typeof paidAmount === 'string' ? Number.parseFloat(paidAmount) || 0 : paidAmount
  store.updatePerson(personId, { paidAmount: amount })
}

// ============================================
// Export/Import
// ============================================
function handleExportCSV() {
  const csv = store.exportToCSV()
  exportCSV(csv, 'mannschaftsfahrt-zahlungen')
}

function handleExportJSON() {
  const json = store.exportToJSON()
  exportJSON(json, 'mannschaftsfahrt-zahlungen')
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return

  importJSON(file, content => store.importFromJSON(content))
  target.value = ''
}

// ============================================
// SEO
// ============================================
useHead({
  title: 'Zahlungstracking - Mannschaftsfahrt',
  meta: [
    { name: 'description', content: 'Verwalte die Zahlungen und Teilnehmerliste der Mannschaftsfahrt' },
  ],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Zahlungstracking"
      description="Verwalte die Teilnehmer und ihre Zahlungen"
    />

    <div class="space-y-6">
      <!-- Gesamtbetrag -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Gesamtbetrag
          </h2>
        </template>

        <div>
          <label
            for="totalAmount"
            class="mb-2 block text-sm font-medium"
          >
            Gesamtbetrag pro Teilnehmer (€)
          </label>
          <UInput
            id="totalAmount"
            v-model.number="totalAmount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            size="lg"
          />
        </div>
      </UCard>

      <!-- Teilnehmerliste -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">
              Teilnehmerliste
            </h2>
            <UButton
              icon="i-lucide-plus"
              @click="addPlayer"
            >
              Teilnehmer hinzufügen
            </UButton>
          </div>
        </template>

        <div
          v-if="paymentData.length === 0"
          class="py-12 text-center"
        >
          <p class="text-muted">
            Noch keine Teilnehmer hinzugefügt. Klicke auf "Teilnehmer hinzufügen" um zu beginnen.
          </p>
        </div>

        <UTable
          v-else
          :data="paymentData"
          :columns="columns"
          :meta="tableMeta"
          sticky
        >
          <template #name-cell="{ row }">
            <UInput
              v-model="row.original.name"
              placeholder="Teilnehmer"
              size="sm"
              @blur="updatePersonName(row.original.id, row.original.name)"
            />
          </template>

          <template #paidAmount-cell="{ row }">
            <UInput
              v-model.number="row.original.paidAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              size="sm"
              @blur="updatePersonPaidAmount(row.original.id, row.original.paidAmount)"
            />
          </template>

          <template #remainingAmount-cell="{ row }">
            <span class="font-semibold">
              {{ formatCurrency(row.original.remainingAmount) }}
            </span>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :color="getStatusColor(row.original.status)"
              variant="solid"
            >
              {{ getStatusText(row.original.status) }}
            </UBadge>
          </template>

          <template #actions-cell="{ row }">
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="removePerson(row.original.id)"
            />
          </template>
        </UTable>
      </UCard>

      <!-- Zusammenfassung -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Zusammenfassung
          </h2>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-muted">Anzahl Teilnehmer:</span>
            <span class="font-semibold">{{ store.personCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Gesamtbetrag pro Teilnehmer:</span>
            <span class="font-semibold">{{ formatCurrency(store.totalAmount) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Bereits gezahlt:</span>
            <span class="font-semibold text-success">{{ formatCurrency(store.totalPaid) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Noch offen:</span>
            <span class="font-semibold text-warning">{{ formatCurrency(store.pendingAmount) }}</span>
          </div>
          <USeparator />
          <div class="flex items-center justify-between text-lg">
            <span class="font-semibold">Erwarteter Gesamtbetrag:</span>
            <span class="font-bold">{{ formatCurrency(store.expectedTotal) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Export & Import -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Daten exportieren & importieren
          </h2>
        </template>

        <p class="mb-4 text-sm text-muted">
          💾 Daten werden automatisch im Browser gespeichert. Du kannst sie auch als Datei exportieren oder importieren.
        </p>

        <div class="flex flex-wrap gap-3">
          <UButton
            icon="i-lucide-file-spreadsheet"
            @click="handleExportCSV"
          >
            Als CSV exportieren
          </UButton>
          <UButton
            icon="i-lucide-file-json"
            @click="handleExportJSON"
          >
            Als JSON exportieren
          </UButton>
          <UButton
            icon="i-lucide-upload"
            color="secondary"
            variant="outline"
            @click="triggerFileInput"
          >
            Daten importieren
          </UButton>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileImport"
          >
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
