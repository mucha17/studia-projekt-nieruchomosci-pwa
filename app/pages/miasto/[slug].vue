<script setup lang="ts">
import type { City } from '~/server/types/city'
import type { PropertyListing } from '~/server/types/listing'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { isLoggedIn } = useAuth()
const { isFavorite, toggleFavorite } = useFavorites()

const { data: cities } = useCities()
const city = computed<City | undefined>(() =>
  cities.value?.find(c => c.id === slug.value)
)

const queryTransaction = computed(() => (route.query.transaction as string) || '')
const queryType = computed(() => (route.query.type as string) || '')

const { data: listings, pending } = useFetch<PropertyListing[]>('/api/listings', {
  query: {
    city: computed(() => city.value?.name ?? ''),
    transaction: queryTransaction,
    type: queryType,
  },
  watch: [city, queryTransaction, queryType],
})

const cityName = computed(() => city.value?.name ?? slug.value)
const voivodeship = computed(() => city.value?.voivodeship ?? '')

const transactionLabels: Record<string, string> = {
  sprzedaz: 'sprzedaży',
  wynajem: 'wynajmu',
}
const activeTransactionLabel = computed(() => {
  const t = queryTransaction.value
  if (!t) return 'sprzedaży i wynajmu'
  return transactionLabels[t] ?? 'sprzedaży i wynajmu'
})
const listingCount = computed(() => listings.value?.length ?? 0)

// Pagination
const ITEMS_PER_PAGE = 6
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil((listings.value?.length ?? 0) / ITEMS_PER_PAGE))
)

const paginatedListings = computed(() => {
  if (!listings.value) return []
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return listings.value.slice(start, start + ITEMS_PER_PAGE)
})

const featuredListings = computed(() => paginatedListings.value.slice(0, 3))
const remainingListings = computed(() => paginatedListings.value.slice(3))

const visiblePages = computed(() => {
  const pages: (number | 'dots')[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('dots')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('dots')
    pages.push(total)
  }
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Reset page when city changes
watch(slug, () => {
  currentPage.value = 1
})

useHead({
  title: computed(() => `Nieruchomości ${cityName.value} - Ogłoszenia sprzedaży i wynajmu`),
})

function formatPrice(price: number): string {
  return price.toLocaleString('pl-PL')
}
</script>

<template>
  <div class="city-page">
    <!-- City header -->
    <section class="city-header">
      <div class="max-w-container mx-auto px-4 py-6">
        <h1 class="text-xl md:text-2xl font-bold text-dark-text">
          Nieruchomości {{ cityName }}
        </h1>
        <p class="text-sm text-gray-text mt-1">
          Ogłoszenia {{ activeTransactionLabel }} nieruchomości w {{ cityName }}
          <span v-if="voivodeship"> w {{ voivodeship }}</span>
        </p>
        <p class="text-xs text-gray-text mt-1">
          {{ formatPrice(listingCount) }} ogłoszeń
        </p>
      </div>
    </section>

    <!-- Listings grid -->
    <section class="city-listings">
      <div class="max-w-container mx-auto px-4 py-6">
        <!-- Loading state -->
        <div v-if="pending" class="text-center py-12 text-gray-text">
          Ładowanie ogłoszeń...
        </div>

        <!-- Empty state -->
        <div v-else-if="!listings?.length" class="text-center py-12">
          <p class="text-gray-text text-lg mb-4">Brak ogłoszeń dla tego miasta</p>
          <BaseButton variant="primary" tag="nuxt-link" href="/">
            Wróć na stronę główną
          </BaseButton>
        </div>

        <!-- Listings -->
        <div v-else>
          <!-- Featured top row (first 3 with images) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <NuxtLink
              v-for="listing in featuredListings"
              :key="listing.id"
              :to="`/ogloszenie/${listing.id}`"
              class="listing-card listing-card--featured"
            >
              <div class="listing-card__image">
                <img
                  :src="listing.imageUrl"
                  :alt="listing.title"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-size=%2216%22>Brak zdjęcia</text></svg>'"
                />
              </div>
              <div class="listing-card__body">
                <h3 class="listing-card__title">{{ listing.title }}</h3>
                <p class="listing-card__location">
                  {{ listing.city }}<span v-if="listing.district">, {{ listing.district }}</span>
                </p>
                <div class="listing-card__details">
                  <span class="listing-card__price">{{ formatPrice(listing.price) }} {{ listing.transactionType === 'wynajem' ? 'zł/mies.' : 'zł' }}</span>
                  <span class="listing-card__area">{{ listing.area }} m²</span>
                  <span v-if="listing.rooms" class="listing-card__rooms">{{ listing.rooms }} {{ listing.rooms === 1 ? 'pokój' : listing.rooms < 5 ? 'pokoje' : 'pokoi' }}</span>
                </div>
                <p class="listing-card__price-m2">{{ formatPrice(listing.pricePerM2) }} zł/m²</p>
                <p class="listing-card__agency">{{ listing.agencyName }}</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Remaining listings (compact list) -->
          <div v-if="remainingListings.length" class="space-y-3">
            <NuxtLink
              v-for="listing in remainingListings"
              :key="listing.id"
              :to="`/ogloszenie/${listing.id}`"
              class="listing-row"
            >
              <div class="listing-row__image">
                <img
                  :src="listing.imageUrl"
                  :alt="listing.title"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 150%22><rect fill=%22%23f3f4f6%22 width=%22200%22 height=%22150%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-size=%2212%22>Brak zdjęcia</text></svg>'"
                />
              </div>
              <div class="listing-row__body">
                <h3 class="listing-row__title">{{ listing.title }}</h3>
                <p class="listing-row__location">
                  {{ listing.city }}<span v-if="listing.district">, {{ listing.district }}</span>
                </p>
                <div class="listing-row__details">
                  <span class="listing-row__price">{{ formatPrice(listing.price) }} {{ listing.transactionType === 'wynajem' ? 'zł/mies.' : 'zł' }}</span>
                  <span class="listing-row__sep">|</span>
                  <span>{{ listing.area }} m²</span>
                  <span v-if="listing.rooms" class="listing-row__sep">|</span>
                  <span v-if="listing.rooms">{{ listing.rooms }} {{ listing.rooms === 1 ? 'pokój' : listing.rooms < 5 ? 'pokoje' : 'pokoi' }}</span>
                  <span class="listing-row__sep">|</span>
                  <span>{{ formatPrice(listing.pricePerM2) }} zł/m²</span>
                </div>
                <p class="listing-row__agency">{{ listing.agencyName }}</p>
              </div>
              <div v-if="isLoggedIn" class="listing-row__actions">
                <button
                  class="listing-row__fav"
                  :class="{ 'listing-row__fav--active': isFavorite(listing.id) }"
                  aria-label="Dodaj do ulubionych"
                  @click.prevent="toggleFavorite(listing.id)"
                >
                  <BaseIcon name="heart" :size="18" />
                </button>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-2">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <BaseIcon name="chevron-left" :size="16" />
            </button>
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === 'dots'" class="pagination-btn pagination-btn--dots">...</span>
              <button
                v-else
                class="pagination-btn"
                :class="{ 'pagination-btn--active': page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>
            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <BaseIcon name="chevron-right" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.city-page {
  background: #fff;
}

.city-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

// Featured cards (top row)
.listing-card,
.listing-row {
  text-decoration: none;
  color: inherit;
}

.listing-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }

  &__image {
    height: 180px;
    background: #f3f4f6;
  }

  &__body {
    padding: 12px;
  }

  &__title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__location {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 8px;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.75rem;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  &__price {
    font-weight: 700;
    color: #1a1a1a;
  }

  &__price-m2 {
    font-size: 0.6875rem;
    color: #999;
    margin-bottom: 6px;
  }

  &__agency {
    font-size: 0.6875rem;
    color: #999;
  }
}

// Compact row listings
.listing-row {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }

  &__image {
    width: 120px;
    height: 90px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background: #f3f4f6;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__location {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 6px;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.8125rem;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  &__price {
    font-weight: 700;
    color: #1a1a1a;
  }

  &__sep {
    color: #d1d5db;
  }

  &__agency {
    font-size: 0.6875rem;
    color: #999;
  }

  &__actions {
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;
  }

  &__fav {
    padding: 6px;
    color: #ccc;
    transition: color 0.15s;
    cursor: pointer;

    &:hover {
      color: #2563eb;
    }

    &--active {
      color: #2563eb;
    }
  }
}

// Pagination
.pagination-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  &--active {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;

    &:hover {
      background: #1d4ed8;
    }
  }

  &--dots {
    border: none;
    cursor: default;
    color: #999;

    &:hover {
      border: none;
      color: #999;
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
