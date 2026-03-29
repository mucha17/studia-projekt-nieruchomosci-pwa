import type { Article } from '~/server/types/article'

export function useArticles() {
  return useFetch<Article[]>('/api/articles')
}
