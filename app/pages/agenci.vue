<script setup lang="ts">
import type { Agent } from '~/server/types/agent'

useHead({
  title: 'Agenci nieruchomości - Nieruchomości Testowe',
})

const { isLoggedIn } = useAuth()
const { data: agents, pending } = useAgents()

const selectedAgent = ref<Agent | null>(null)

function openModal(agent: Agent) {
  if (!isLoggedIn.value) {
    navigateTo('/logowanie')
    return
  }
  selectedAgent.value = agent
}

function closeModal() {
  selectedAgent.value = null
}
</script>

<template>
  <div class="agents-page">
    <section class="agents-header">
      <div class="max-w-container mx-auto px-4 py-6">
        <h1 class="text-xl md:text-2xl font-bold text-dark-text">
          Agenci nieruchomości
        </h1>
        <p class="text-sm text-gray-text mt-1">
          Znajdź doświadczonego agenta, który pomoże Ci w zakupie, sprzedaży lub wynajmie nieruchomości
        </p>
      </div>
    </section>

    <section class="max-w-container mx-auto px-4 py-8">
      <div v-if="pending" class="text-center py-12 text-gray-text">
        Ładowanie agentów...
      </div>

      <div v-else-if="agents?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <button
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          @click="openModal(agent)"
        >
          <div class="agent-card__avatar">
            <img :src="agent.photoUrl" :alt="agent.name" class="w-full h-full object-cover rounded-full" />
          </div>
          <div class="agent-card__info">
            <h3 class="agent-card__name">{{ agent.name }}</h3>
            <p class="agent-card__agency">{{ agent.agency }}</p>
            <p class="agent-card__meta">
              <BaseIcon name="map-pin" :size="13" class="inline -mt-0.5" />
              {{ agent.city }}
              <span class="agent-card__sep">&middot;</span>
              {{ agent.specialization }}
            </p>
          </div>
        </button>
      </div>
    </section>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedAgent"
          class="modal-overlay"
          @click.self="closeModal"
        >
          <div class="modal-card">
            <button class="modal-card__close" aria-label="Zamknij" @click="closeModal">
              <BaseIcon name="x" :size="20" />
            </button>

            <div class="modal-card__avatar">
              <img :src="selectedAgent.photoUrl" :alt="selectedAgent.name" class="w-full h-full object-cover" />
            </div>

            <h2 class="modal-card__name">{{ selectedAgent.name }}</h2>
            <p class="modal-card__agency">{{ selectedAgent.agency }}</p>
            <p class="modal-card__spec">
              <BaseIcon name="map-pin" :size="14" class="inline -mt-0.5" />
              {{ selectedAgent.city }}
              <span class="mx-1">&middot;</span>
              {{ selectedAgent.specialization }}
            </p>

            <div class="modal-card__contacts">
              <a :href="`tel:${selectedAgent.phone}`" class="modal-card__contact">
                <BaseIcon name="phone" :size="18" />
                <span>{{ selectedAgent.phone }}</span>
              </a>
              <a :href="`mailto:${selectedAgent.email}`" class="modal-card__contact">
                <BaseIcon name="mail" :size="18" />
                <span>{{ selectedAgent.email }}</span>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.agents-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.agent-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  }

  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f3f4f6;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__info {
    min-width: 0;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
  }

  &__agency {
    font-size: 0.8125rem;
    color: #666;
    margin-bottom: 4px;
  }

  &__meta {
    font-size: 0.75rem;
    color: #999;
  }

  &__sep {
    margin: 0 4px;
  }
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
  padding: 16px;
}

.modal-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 36px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 30px rgb(0 0 0 / 15%);

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    color: #999;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #1a1a1a;
    }
  }

  &__avatar {
    width: 180px;
    height: 180px;
    border-radius: 12px;
    background: #f3f4f6;
    overflow: hidden;
    margin: 0 auto 16px;
  }

  &__name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  &__agency {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 4px;
  }

  &__spec {
    font-size: 0.8125rem;
    color: #999;
    margin-bottom: 24px;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__contact {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9375rem;
    color: #1a1a1a;
    text-decoration: none;
    transition: all 0.15s;

    &:hover {
      border-color: #2563eb;
      color: #2563eb;
    }
  }
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-card {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-card {
    transform: scale(0.95);
  }
}
</style>
