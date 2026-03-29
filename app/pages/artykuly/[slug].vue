<script setup lang="ts">
import type { Article } from '~/server/types/article'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: article, pending, error } = useFetch<Article>(() => `/api/articles/${slug.value}`)

useHead({
  title: computed(() => article.value ? `${article.value.title} - Nieruchomości Testowe` : 'Artykuł - Nieruchomości Testowe'),
})
</script>

<template>
  <div class="article-page">
    <div v-if="pending" class="text-center py-16 text-gray-text">Ładowanie artykułu...</div>
    <template v-else-if="article">
      <section class="article-header">
        <div class="max-w-container mx-auto px-4 py-8">
          <NuxtLink to="/" class="text-sm text-gray-text hover:text-primary mb-4 inline-block">
            &larr; Strona główna
          </NuxtLink>
          <h1 class="text-2xl md:text-3xl font-bold text-dark-text">
            {{ article.title }}
          </h1>
          <p class="text-base text-gray-text mt-2">
            {{ article.lead }}
          </p>
        </div>
      </section>

      <section class="max-w-container mx-auto px-4 py-8">
        <div class="article-body">
          <p
            v-for="(paragraph, i) in article.content"
            :key="i"
            class="mb-4 text-dark-text leading-relaxed"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>
    </template>

    <div v-else class="text-center py-16">
      <p class="text-gray-text text-lg mb-4">Artykuł nie został znaleziony</p>
      <BaseButton variant="primary" tag="nuxt-link" href="/">
        Wróć na stronę główną
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.article-body {
  max-width: 720px;
  font-size: 0.9375rem;
}
</style>
