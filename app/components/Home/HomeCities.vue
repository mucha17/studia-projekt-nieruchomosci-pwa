<script setup lang="ts">
const { data: cities } = useCities()
const { data: listings } = useListings()

const listingCountByCity = computed(() => {
  const counts: Record<string, number> = {}
  for (const listing of listings.value ?? []) {
    const key = listing.city.toLowerCase()
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
})

const topCities = computed(() => {
  if (!cities.value) return []
  return cities.value
    .map(city => ({
      ...city,
      realCount: listingCountByCity.value[city.name.toLowerCase()] ?? 0,
    }))
    .filter(city => city.realCount > 0)
    .sort((a, b) => b.realCount - a.realCount)
    .slice(0, 12)
})

function formatCount(n: number): string {
  return n.toLocaleString('pl-PL')
}
</script>

<template>
  <section class="cities-section">
    <div class="max-w-container mx-auto px-4 py-10">
      <h2 class="text-lg md:text-xl font-bold text-dark-text mb-6">
        Popularne miasta
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <NuxtLink
          v-for="city in topCities"
          :key="city.id"
          :to="`/miasto/${city.id}`"
          class="city-tile"
        >
          <span class="city-tile__name">{{ city.name }}</span>
          <span class="city-tile__count">{{ formatCount(city.realCount) }} {{ city.realCount === 1 ? 'ogłoszenie' : city.realCount < 5 ? 'ogłoszenia' : 'ogłoszeń' }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cities-section {
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.city-tile {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
  }

  &__count {
    font-size: 0.6875rem;
    color: #999;
  }
}
</style>
