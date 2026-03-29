<script setup lang="ts">
import type { InvestmentStatus } from '~/server/types/investment'

useHead({
  title: 'Inwestycje - Nieruchomości Testowe',
})

const { data: investments, pending } = useInvestments()

type FilterValue = 'wszystkie' | InvestmentStatus

const activeFilter = ref<FilterValue>('wszystkie')

const filters: { value: FilterValue; label: string }[] = [
  { value: 'wszystkie', label: 'Wszystkie' },
  { value: 'nowa', label: 'Nowe' },
  { value: 'w-budowie', label: 'W budowie' },
  { value: 'gotowa', label: 'Gotowe' },
  { value: 'w-sprzedazy', label: 'W sprzedaży' },
]

const statusLabels: Record<InvestmentStatus, string> = {
  'nowa': 'Nowa',
  'w-budowie': 'W budowie',
  'gotowa': 'Gotowa',
  'w-sprzedazy': 'W sprzedaży',
}

const statusColors: Record<InvestmentStatus, string> = {
  'nowa': 'bg-green-100 text-green-700',
  'w-budowie': 'bg-yellow-100 text-yellow-700',
  'gotowa': 'bg-blue-100 text-blue-700',
  'w-sprzedazy': 'bg-blue-100 text-blue-700',
}

const filteredInvestments = computed(() => {
  if (!investments.value) return []
  if (activeFilter.value === 'wszystkie') return investments.value
  return investments.value.filter(i => i.status === activeFilter.value)
})
</script>

<template>
  <div class="investments-page">
    <section class="investments-header">
      <div class="max-w-container mx-auto px-4 py-6">
        <h1 class="text-xl md:text-2xl font-bold text-dark-text">
          Inwestycje deweloperskie
        </h1>
        <p class="text-sm text-gray-text mt-1">
          Wszystkie inwestycje mieszkaniowe — nowe, w budowie, gotowe i w sprzedaży
        </p>
      </div>
    </section>

    <section class="max-w-container mx-auto px-4 py-8">
      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <div v-if="pending" class="text-center py-12 text-gray-text">
        Ładowanie inwestycji...
      </div>

      <div v-else-if="filteredInvestments.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="investment in filteredInvestments"
          :key="investment.id"
          :to="`/inwestycja/${investment.id}`"
          class="block"
        >
        <BaseCard
          :hoverable="true"
          :padding="false"
        >
          <div class="relative">
            <img
              :src="investment.imageUrl"
              :alt="investment.name"
              class="w-full aspect-[4/3] object-cover bg-gray-200"
              loading="lazy"
            />
            <span
              class="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded"
              :class="statusColors[investment.status]"
            >
              {{ statusLabels[investment.status] }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-base text-dark-text mb-1">
              {{ investment.name }}
            </h3>
            <p class="text-sm text-gray-text capitalize">
              {{ investment.cityName }}, {{ investment.regionName }}
            </p>
            <p class="text-sm font-medium text-dark-text mt-2">
              {{ investment.areaRange }}
            </p>
          </div>
        </BaseCard>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12 text-gray-text">
        Brak inwestycji dla wybranego filtra
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.investments-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.filter-btn {
  padding: 6px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 0.8125rem;
  color: #666;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  &--active {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;

    &:hover {
      background: #1d4ed8;
      color: #fff;
    }
  }
}
</style>
