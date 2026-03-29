import type { PropertyListing } from '~/server/types/listing'

export function useFeatured() {
  return useFetch<PropertyListing[]>('/api/featured')
}
