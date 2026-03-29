import type { Agent } from '~/server/types/agent'

export function useAgents() {
  return useFetch<Agent[]>('/api/agents')
}
