<script setup lang="ts">
useHead({
  title: 'Mannschaftsfahrt - Startseite',
  meta: [
    { name: 'description', content: 'Verwaltung der Mannschaftsfahrt - Zahlungstracking und Teilnehmerliste' },
  ],
})
</script>

<template>
  <div class="overflow-x-hidden">
    <UPageHero
      title="FCWO Tour 2026"
      description="Willkommen zur Verwaltung der Mannschaftsfahrt. Hier kannst du alle Zahlungen und Teilnehmer verwalten, den Überblick über offene Beträge behalten und die Finanzen im Blick haben."
      :links="[{
        label: 'Zum Zahlungstracking',
        to: '/zahlungen',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
      }]"
    />

    <UPageSection
      title="Über die Mannschaftsfahrt"
      description="Eine gemeinsame Reise mit der Mannschaft - organisiert und übersichtlich verwaltet."
    >
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Zahlungstracking
            </h3>
          </template>
          <p class="wrap-break-word text-muted">
            Verwalte alle Zahlungen der Teilnehmer übersichtlich und behalte den Überblick über offene Beträge.
          </p>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Teilnehmerliste
            </h3>
          </template>
          <p class="wrap-break-word text-muted">
            Füge Teilnehmer hinzu, verwalte ihre Zahlungsstatus und sehe auf einen Blick, wer bereits gezahlt hat.
          </p>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Export & Import
            </h3>
          </template>
          <p class="wrap-break-word text-muted">
            Exportiere deine Daten als CSV oder JSON und importiere sie bei Bedarf wieder.
          </p>
        </UCard>
      </div>
    </UPageSection>
  </div>
</template>
