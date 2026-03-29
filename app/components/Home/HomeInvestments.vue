<script setup lang="ts">
const { data: investments } = useInvestments()
</script>

<template>
  <section class="bg-gray-bg py-10 md:py-16">
    <div class="max-w-container mx-auto px-4">
      <h2 class="text-2xl font-bold text-dark-text mb-8">
        Nowe mieszkania i domy
      </h2>

      <BaseCarousel
        v-if="investments && investments.length > 0"
        :items-per-view="3"
        :gap="16"
      >
        <NuxtLink
          v-for="investment in investments"
          :key="investment.id"
          :to="`/inwestycja/${investment.id}`"
          class="block"
        >
          <BaseCard
            :hoverable="true"
            :padding="false"
          >
            <img
              :src="investment.imageUrl"
              :alt="investment.name"
              class="w-full aspect-[4/3] object-cover bg-gray-200"
              loading="lazy"
            />
            <div class="p-4">
              <h3 class="font-bold text-base text-dark-text mb-1 line-clamp-2">
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
      </BaseCarousel>

      <div class="flex justify-center mt-8">
        <BaseButton variant="outline" tag="nuxt-link" href="/inwestycje">
          Zobacz wszystkie inwestycje
          <BaseIcon name="chevron-right" :size="16" class="ml-1" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>
