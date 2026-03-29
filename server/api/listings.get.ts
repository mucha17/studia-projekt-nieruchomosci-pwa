import { listings } from '../data/listings'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let result = [...listings]

  if (query.city && typeof query.city === 'string') {
    const cityLower = query.city.toLowerCase()
    result = result.filter(l => l.city.toLowerCase() === cityLower)
  }

  if (query.type && typeof query.type === 'string') {
    result = result.filter(l => l.type === query.type)
  }

  if (query.transaction && typeof query.transaction === 'string') {
    result = result.filter(l => l.transactionType === query.transaction)
  }

  return result
})
