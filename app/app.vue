<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Startseite',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Zahlungstracking',
    icon: 'i-lucide-credit-card',
    to: '/zahlungen',
  },
])

const title = 'Mannschaftsfahrt - Zahlungstracking'
const description = 'Verwaltung der Mannschaftsfahrt - Zahlungstracking und Teilnehmerliste'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'de',
  },
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary',
})
</script>

<template>
  <UApp>
    <UHeader mode="drawer">
      <template #title>
        <NuxtImg
          src="/fcwo-logo.png"
          width="40"
          height="40"
          format="webp"
        />
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />
      </template>
      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-center text-sm wrap-break-word text-muted sm:text-left">
          Mannschaftsfahrt Verwaltung • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
