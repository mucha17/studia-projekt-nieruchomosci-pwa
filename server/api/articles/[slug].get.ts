import { articles } from '../../data/articles'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const article = articles.find(a => a.slug === slug)

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return article
})
