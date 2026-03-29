import { investments } from '../../data/investments'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const investment = investments.find(i => i.id === id)

  if (!investment) {
    throw createError({ statusCode: 404, statusMessage: 'Investment not found' })
  }

  return investment
})
