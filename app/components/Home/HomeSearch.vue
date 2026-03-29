<script setup lang="ts">
import type { PropertyListing } from '~/server/types/listing'

type TransactionType = 'kupie' | 'wynajme'

interface CategoryTab {
  value: string
  label: string
}

interface Suggestion {
  type: 'city' | 'listing'
  label: string
  sub: string
  route: string
}

const activeTransaction = ref<TransactionType>('kupie')
const activeCategory = ref<string>('mieszkania')
const locationQuery = ref('')
const showSuggestions = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const { data: cities } = useCities()
const { data: listings } = useListings()

const categories: CategoryTab[] = [
  { value: 'mieszkania', label: 'Mieszkania' },
  { value: 'pokoje', label: 'Pokoje' },
  { value: 'domy', label: 'Domy' },
  { value: 'dzialki', label: 'Działki' },
  { value: 'lokale-uzytkowe', label: 'Lokale użytkowe' },
  { value: 'budynki-uzytkowe', label: 'Budynki użytkowe' },
]

const categoryToType: Record<string, string> = {
  'mieszkania': 'mieszkanie',
  'pokoje': 'pokoj',
  'domy': 'dom',
  'dzialki': 'dzialka',
  'lokale-uzytkowe': 'lokal',
  'budynki-uzytkowe': 'budynek',
}

const transactionToType: Record<TransactionType, string> = {
  'kupie': 'sprzedaz',
  'wynajme': 'wynajem',
}

const filteredListings = computed(() => {
  if (!listings.value) return []
  const transaction = transactionToType[activeTransaction.value]
  const type = categoryToType[activeCategory.value]
  return listings.value.filter((l: PropertyListing) => {
    if (l.transactionType !== transaction) return false
    if (type && l.type !== type) return false
    return true
  })
})

const suggestions = computed<Suggestion[]>(() => {
  const q = locationQuery.value.trim().toLowerCase()
  if (q.length < 2) return []

  const results: Suggestion[] = []
  const transactionLabel = activeTransaction.value === 'kupie' ? 'kupno' : 'wynajem'

  // Match cities
  if (cities.value) {
    const matchedCities = cities.value
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 4)
    for (const c of matchedCities) {
      // Count real filtered listings for this city
      const cityListingCount = filteredListings.value.filter(
        l => l.city.toLowerCase() === c.name.toLowerCase()
      ).length
      results.push({
        type: 'city',
        label: c.name,
        sub: `${cityListingCount} ogłoszeń · ${transactionLabel} · ${c.voivodeship}`,
        route: `/miasto/${c.id}?transaction=${transactionToType[activeTransaction.value]}&type=${categoryToType[activeCategory.value] ?? ''}`,
      })
    }
  }

  // Match listings (already filtered by transaction & category)
  const matchedListings = filteredListings.value
    .filter((l: PropertyListing) =>
      l.title.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      (l.district && l.district.toLowerCase().includes(q))
    )
    .slice(0, 5)
  for (const l of matchedListings) {
    results.push({
      type: 'listing',
      label: l.title,
      sub: `${l.city}${l.district ? ', ' + l.district : ''} · ${l.price.toLocaleString('pl-PL')} zł`,
      route: `/ogloszenie/${l.id}`,
    })
  }

  return results.slice(0, 8)
})

function setTransaction(type: TransactionType): void {
  activeTransaction.value = type
}

function setCategory(value: string): void {
  activeCategory.value = value
}

function onInput() {
  showSuggestions.value = locationQuery.value.trim().length >= 2
}

function selectSuggestion(suggestion: Suggestion) {
  showSuggestions.value = false
  locationQuery.value = ''
  navigateTo(suggestion.route)
}

function buildCityRoute(cityId: string): string {
  const params = new URLSearchParams()
  params.set('transaction', transactionToType[activeTransaction.value])
  const type = categoryToType[activeCategory.value]
  if (type) params.set('type', type)
  return `/miasto/${cityId}?${params.toString()}`
}

function handleSearch(): void {
  showSuggestions.value = false
  const q = locationQuery.value.trim()
  if (!q) return

  const city = cities.value?.find(c => c.name.toLowerCase() === q.toLowerCase())
    ?? cities.value?.find(c => c.name.toLowerCase().includes(q.toLowerCase()))

  if (city) {
    navigateTo(buildCityRoute(city.id))
    return
  }

  const slug = q
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/\s+/g, '-')
  navigateTo(buildCityRoute(slug))
}

function onBlur() {
  // Delay to allow click on suggestion
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<template>
  <div>
    <!-- Category tabs -->
    <div class="flex gap-1 border-b border-gray-border mb-4 overflow-x-auto">
      <button
        v-for="cat in categories"
        :key="cat.value"
        type="button"
        class="category-tab whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
        :class="activeCategory === cat.value ? 'category-tab--active' : 'category-tab--inactive'"
        @click="setCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Search controls row -->
    <div class="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2">
      <!-- Transaction type toggle -->
      <div class="flex flex-shrink-0">
        <button
          type="button"
          class="transaction-btn rounded-l-sm px-4 py-2.5 text-sm font-medium transition-colors"
          :class="activeTransaction === 'kupie' ? 'transaction-btn--active' : 'transaction-btn--inactive'"
          @click="setTransaction('kupie')"
        >
          Kupię
        </button>
        <button
          type="button"
          class="transaction-btn rounded-r-sm px-4 py-2.5 text-sm font-medium transition-colors"
          :class="activeTransaction === 'wynajme' ? 'transaction-btn--active' : 'transaction-btn--inactive'"
          @click="setTransaction('wynajme')"
        >
          Wynajmę
        </button>
      </div>

      <!-- Location input with suggestions -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <BaseIcon
            name="map-pin"
            :size="18"
            class="text-gray-icon"
          />
        </div>
        <input
          ref="inputRef"
          v-model="locationQuery"
          type="text"
          placeholder="Wpisz miejscowość, dzielnicę lub ulicę"
          class="w-full h-full border border-gray-border rounded-sm pl-10 pr-3 py-2.5 text-sm text-dark-text placeholder:text-gray-icon focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          autocomplete="off"
          @input="onInput"
          @focus="onInput"
          @blur="onBlur"
          @keydown.enter="handleSearch"
        />

        <!-- Suggestions dropdown -->
        <div
          v-if="showSuggestions && suggestions.length > 0"
          class="suggestions"
        >
          <button
            v-for="s in suggestions"
            :key="s.route"
            class="suggestion"
            @mousedown.prevent="selectSuggestion(s)"
          >
            <BaseIcon
              :name="s.type === 'city' ? 'map-pin' : 'home'"
              :size="16"
              class="suggestion__icon"
            />
            <div class="suggestion__text">
              <span class="suggestion__label">{{ s.label }}</span>
              <span class="suggestion__sub">{{ s.sub }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="button"
        class="flex items-center justify-center gap-2 flex-shrink-0 bg-primary text-white rounded-sm px-6 py-3 font-medium text-sm hover:bg-primary-hover transition-colors"
        @click="handleSearch"
      >
        <BaseIcon
          name="search"
          :size="18"
          color="white"
        />
        <span>Poszukajmy</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-tab {
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;

  &--active {
    color: theme('colors.primary.DEFAULT');
    border-bottom-color: theme('colors.primary.DEFAULT');
    font-weight: 600;
  }

  &--inactive {
    color: theme('colors.gray-text');

    &:hover {
      color: theme('colors.dark-text');
    }
  }
}

.transaction-btn {
  &--active {
    background-color: theme('colors.primary.DEFAULT');
    color: #fff;
  }

  &--inactive {
    background-color: theme('colors.gray-bg');
    color: theme('colors.dark-text');

    &:hover {
      background-color: #e8e8e8;
    }
  }
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  max-height: 360px;
  overflow-y: auto;
}

.suggestion {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.1s;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }

  &__icon {
    color: #999;
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__sub {
    font-size: 0.75rem;
    color: #999;
  }
}
</style>
