import type { Investment } from '~/server/types/investment'

export function useInvestments() {
  return useFetch<Investment[]>('/api/investments')
}
