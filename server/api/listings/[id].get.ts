import { listings } from '../../data/listings'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const listing = listings.find(l => l.id === id)

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }

  return listing
})
