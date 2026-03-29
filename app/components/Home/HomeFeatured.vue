<script setup lang="ts">
const { data: featured } = useFeatured()

function formatPrice(n: number): string {
  return new Intl.NumberFormat('pl-PL').format(n)
}

const displayedListings = computed(() => {
  if (!featured.value) return []
  return featured.value.slice(0, 6)
})
</script>

<template>
  <section class="bg-white py-10 md:py-16">
    <div class="max-w-container mx-auto px-4">
      <h2 class="text-2xl font-bold text-dark-text mb-8">
        Nasi faworyci na dziś
      </h2>

      <div
        v-if="displayedListings.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <NuxtLink
          v-for="listing in displayedListings"
          :key="listing.id"
          :to="`/ogloszenie/${listing.id}`"
          class="block"
        >
        <BaseCard
          :hoverable="true"
          :padding="false"
        >
          <img
            :src="listing.imageUrl"
            :alt="listing.title"
            class="w-full aspect-[4/3] object-cover bg-gray-200"
            loading="lazy"
          />
          <div class="p-4">
            <h3 class="font-bold text-base text-dark-text mb-1 line-clamp-2">
              {{ listing.title }}
            </h3>
            <p class="text-sm text-gray-text">
              {{ listing.city }}<template v-if="listing.district">, {{ listing.district }}</template>
            </p>

            <!-- Price -->
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-xl font-bold text-dark-text">
                {{ formatPrice(listing.price) }} zł
              </span>
            </div>

            <!-- Details -->
            <div class="mt-1 flex gap-4 text-sm text-gray-text">
              <span>{{ listing.area }} m²</span>
              <span>{{ formatPrice(listing.pricePerM2) }} zł/m²</span>
              <span v-if="listing.rooms">{{ listing.rooms }} pok.</span>
            </div>

            <!-- Agency -->
            <div class="mt-3 pt-3 border-t border-gray-border flex items-center gap-2">
              <img
                v-if="listing.agencyLogoUrl"
                :src="listing.agencyLogoUrl"
                :alt="listing.agencyName"
                class="w-6 h-6 rounded-full object-cover"
              />
              <span class="text-xs text-gray-text">
                {{ listing.agencyName }}
              </span>
            </div>
          </div>
        </BaseCard>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>
