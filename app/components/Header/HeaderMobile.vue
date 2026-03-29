<script setup lang="ts">
interface NavCategory {
  label: string
  slug: string
  type: string
  transaction?: string
}

defineProps<{
  isOpen: boolean
}>()

const { isLoggedIn, logout } = useAuth()
const { count: favCount } = useFavorites()
const { data: cities } = useCities()

const emit = defineEmits<{
  close: []
}>()

const selectedCityId = ref('warszawa')

const sortedCities = computed(() =>
  cities.value?.slice().sort((a, b) => b.listingCount - a.listingCount) ?? []
)

const categories: NavCategory[] = [
  { label: 'Mieszkania', slug: 'mieszkania', type: 'mieszkanie' },
  { label: 'Pokoje', slug: 'pokoje', type: 'pokoj', transaction: 'wynajem' },
  { label: 'Domy', slug: 'domy', type: 'dom' },
  { label: 'Działki', slug: 'dzialki', type: 'dzialka' },
  { label: 'Lokale użytkowe', slug: 'lokale-uzytkowe', type: 'lokal' },
  { label: 'Budynki użytkowe', slug: 'budynki-uzytkowe', type: 'budynek' },
]

function categoryRoute(cat: NavCategory): string {
  const params = new URLSearchParams()
  params.set('type', cat.type)
  if (cat.transaction) params.set('transaction', cat.transaction)
  return `/miasto/${selectedCityId.value}?${params.toString()}`
}

const activeCategory = ref('mieszkania')

function handleOverlayClick() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex"
        @click.self="handleOverlayClick"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="handleOverlayClick"
        />

        <!-- Panel -->
        <div class="mobile-panel relative z-10 bg-white w-80 max-w-full h-full overflow-y-auto shadow-xl">
          <!-- Panel header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-border">
            <span class="font-bold text-lg">
              <span class="text-charcoal">nieruchomosci</span><span class="text-primary">-testowe</span><span class="text-charcoal">.pl</span>
            </span>
            <button
              class="text-gray-text hover:text-dark-text"
              aria-label="Zamknij menu"
              @click="emit('close')"
            >
              <BaseIcon name="x" :size="22" />
            </button>
          </div>

          <!-- Utility links (mobile) -->
          <div class="px-4 py-3 border-b border-gray-border">
            <NuxtLink v-if="isLoggedIn" to="/ulubione" class="flex items-center gap-2 py-2 text-sm text-gray-text hover:text-dark-text" @click="emit('close')">
              <BaseIcon name="heart" :size="16" />
              <span>Ulubione ({{ favCount }})</span>
            </NuxtLink>
            <NuxtLink to="/dodaj-ogloszenie" class="flex items-center gap-2 py-2 text-sm text-primary hover:text-primary-hover" @click="emit('close')">
              <BaseIcon name="plus" :size="16" />
              <span>Dodaj ogłoszenie</span>
            </NuxtLink>
            <template v-if="isLoggedIn">
              <button class="flex items-center gap-2 py-2 text-sm text-gray-text hover:text-dark-text" @click="logout(); emit('close')">
                <BaseIcon name="user" :size="16" />
                <span>Wyloguj się</span>
              </button>
            </template>
            <NuxtLink v-else to="/logowanie" class="flex items-center gap-2 py-2 text-sm text-gray-text hover:text-dark-text" @click="emit('close')">
              <BaseIcon name="user" :size="16" />
              <span>Zaloguj się</span>
            </NuxtLink>
          </div>

          <!-- City selector -->
          <div class="px-4 py-3 border-b border-gray-border">
            <label class="text-xs font-medium text-gray-text mb-1 block">Wybierz miasto</label>
            <select
              v-model="selectedCityId"
              class="city-select"
            >
              <option
                v-for="city in sortedCities"
                :key="city.id"
                :value="city.id"
              >
                {{ city.name }}
              </option>
            </select>
          </div>

          <!-- Category navigation -->
          <nav aria-label="Kategorie nieruchomości">
            <ul>
              <li
                v-for="category in categories"
                :key="category.slug"
              >
                <NuxtLink
                  :to="categoryRoute(category)"
                  class="block w-full text-left px-4 py-3 text-sm border-b border-gray-border transition-colors"
                  :class="[
                    activeCategory === category.slug
                      ? 'text-primary font-semibold bg-blue-50'
                      : 'text-dark-text hover:bg-gray-bg hover:text-primary'
                  ]"
                  @click="activeCategory = category.slug; emit('close')"
                >
                  {{ category.label }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/inwestycje"
                  class="block w-full text-left px-4 py-3 text-sm border-b border-gray-border transition-colors text-dark-text hover:bg-gray-bg hover:text-primary"
                  @click="emit('close')"
                >
                  Inwestycje
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;

  .mobile-panel {
    transition: transform 0.25s ease;
  }
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;

  .mobile-panel {
    transform: translateX(-100%);
  }
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;

  .mobile-panel {
    transform: translateX(0);
  }
}

a {
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

.city-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
  }
}
</style>
