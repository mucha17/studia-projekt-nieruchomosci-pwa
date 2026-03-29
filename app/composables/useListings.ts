import type { PropertyListing } from '~/server/types/listing'

export function useListings() {
  return useFetch<PropertyListing[]>('/api/listings')
}
