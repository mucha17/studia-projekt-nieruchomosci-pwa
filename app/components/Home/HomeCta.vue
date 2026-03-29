<script setup lang="ts">
</script>

<template>
  <section class="py-10 md:py-16">
    <div class="max-w-container mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-4 md:gap-6">
        <!-- Agent help banner -->
        <div class="flex-1 rounded-md p-8 cta-banner cta-banner--agent">
          <h3 class="text-xl font-bold text-dark-text mb-2">
            Potrzebujesz pomocy agenta?
          </h3>
          <p class="text-sm text-gray-text mb-6">
            Skorzystaj z pomocy doświadczonego agenta nieruchomości, który pomoże Ci znaleźć idealne miejsce.
          </p>
          <BaseButton variant="primary" size="md" tag="nuxt-link" href="/agenci">
            Znajdź agenta
          </BaseButton>
        </div>

        <!-- Add listing banner -->
        <div class="flex-1 rounded-md p-8 cta-banner cta-banner--listing">
          <h3 class="text-xl font-bold text-dark-text mb-2">
            Czas na zmiany?
          </h3>
          <p class="text-sm text-gray-text mb-6">
            Dodaj swoje ogłoszenie i dotrzej do tysięcy potencjalnych kupujących lub najemców.
          </p>
          <BaseButton variant="outline" size="md" tag="nuxt-link" href="/dodaj-ogloszenie">
            Dodaj ogłoszenie
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta-banner {
  &--agent {
    background-color: #f3f0ff;
    border: 1px solid #e2ddf5;
  }

  &--listing {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
  }
}
</style>
