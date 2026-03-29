import type { City } from '~/server/types/city'

export function useCities() {
  return useFetch<City[]>('/api/cities')
}
