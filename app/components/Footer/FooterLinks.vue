<script setup lang="ts">
interface FooterLink {
  label: string
  to?: string
}

interface FooterLinkColumn {
  heading: string
  links: FooterLink[]
}

const columns: FooterLinkColumn[] = [
  {
    heading: 'Na skróty',
    links: [
      { label: 'Moje konto', to: '/logowanie' },
      { label: 'Ulubione', to: '/ulubione' },
      { label: 'Znajdź agenta', to: '/agenci' },
      { label: 'Inwestycje', to: '/inwestycje' },
    ],
  },
  {
    heading: 'Oferta',
    links: [
      { label: 'Dodaj ogłoszenie', to: '/dodaj-ogloszenie' },
      { label: 'Regulamin', to: '/regulamin' },
      { label: 'Polityka prywatności', to: '/polityka-prywatnosci' },
    ],
  },
  {
    heading: 'Artykuły i porady',
    links: [
      { label: 'Poradnik dla kupujących', to: '/artykuly/poradnik-kupujacego' },
      { label: 'Poradnik dla sprzedających', to: '/artykuly/poradnik-sprzedajacego' },
      { label: 'Rynek nieruchomości 2026', to: '/artykuly/rynek-nieruchomosci-2026' },
      { label: 'Przygotowanie do sprzedaży', to: '/artykuly/jak-przygotowac-mieszkanie-do-sprzedazy' },
    ],
  },
  {
    heading: 'Nieruchomości-testowe.pl',
    links: [
      { label: 'O nas', to: '/o-nas' },
      { label: 'Kontakt', to: '/kontakt' },
    ],
  },
]
</script>

<template>
  <div class="max-w-container mx-auto px-4 py-10">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div
        v-for="column in columns"
        :key="column.heading"
      >
        <h3 class="text-white font-bold text-sm mb-4">
          {{ column.heading }}
        </h3>
        <ul class="list-none p-0 m-0">
          <li
            v-for="link in column.links"
            :key="link.label"
          >
            <NuxtLink
              v-if="link.to"
              :to="link.to"
              class="footer-link"
            >
              {{ link.label }}
            </NuxtLink>
            <span
              v-else
              class="footer-link footer-link--disabled"
            >
              {{ link.label }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-link {
  @apply block text-sm py-1 transition-colors duration-200;
  color: #9ca3af;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #fff;
  }

  &--disabled {
    cursor: default;

    &:hover {
      color: #9ca3af;
    }
  }
}
</style>
