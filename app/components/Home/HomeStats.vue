<script setup lang="ts">
const { data: listings } = useListings()
const { data: cities } = useCities()
const { data: agents } = useAgents()

const listingCount = computed(() => listings.value?.length ?? 0)
const cityCount = computed(() => cities.value?.length ?? 0)
const agentCount = computed(() => agents.value?.length ?? 0)
</script>

<template>
  <section class="bg-white py-10 md:py-16">
    <div class="max-w-container mx-auto px-4">
      <h2 class="text-lg md:text-xl text-dark-text text-center mb-2 font-bold">
        Umożliwiamy Ci to, że łączysz ludzi z ich wymarzonymi nieruchomościami
      </h2>
      <p class="text-sm text-gray-text text-center mb-8">
        Największy serwis z ogłoszeniami nieruchomości
      </p>

      <div class="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
        <div class="flex flex-col items-center text-center p-6 rounded-lg border border-gray-border">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-blue-50">
            <BaseIcon name="building" :size="28" class="text-primary" />
          </div>
          <span class="text-2xl font-bold text-dark-text mb-1">{{ listingCount }}</span>
          <span class="text-sm text-gray-text">ogłoszeń</span>
        </div>

        <div class="flex flex-col items-center text-center p-6 rounded-lg border border-gray-border">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-amber-50">
            <BaseIcon name="map-pin" :size="28" class="text-primary" />
          </div>
          <span class="text-2xl font-bold text-dark-text mb-1">{{ cityCount }}</span>
          <span class="text-sm text-gray-text">miast</span>
        </div>

        <div class="flex flex-col items-center text-center p-6 rounded-lg border border-gray-border">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-violet-50">
            <BaseIcon name="user" :size="28" class="text-primary" />
          </div>
          <span class="text-2xl font-bold text-dark-text mb-1">{{ agentCount }}</span>
          <span class="text-sm text-gray-text">agentów</span>
        </div>
      </div>
    </div>
  </section>
</template>
