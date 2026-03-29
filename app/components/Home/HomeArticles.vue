<script setup lang="ts">
const { data: articles } = useArticles()
</script>

<template>
  <section class="bg-white py-10 md:py-16">
    <div class="max-w-container mx-auto px-4">
      <h2 class="text-2xl font-bold text-dark-text mb-8">
        Artykuły i porady
      </h2>

      <div v-if="articles?.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/artykuly/${article.slug}`"
          class="article-card group rounded-md overflow-hidden"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="article.imageUrl"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div class="p-3">
            <h3 class="text-sm font-medium text-dark-text group-hover:text-primary transition-colors line-clamp-2">
              {{ article.title }}
            </h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.article-card {
  border: 1px solid theme('colors.gray-border');
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }
}
</style>
