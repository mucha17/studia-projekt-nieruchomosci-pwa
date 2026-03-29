<script setup lang="ts">
import type { PropertyListing } from '~/server/types/listing'

const { isLoggedIn } = useAuth()

watch(isLoggedIn, (val) => {
  if (!val) navigateTo('/logowanie')
}, { immediate: true })

useHead({
  title: 'Ulubione i notatki - Nieruchomości Testowe',
})

const { ids: favoriteIds, toggleFavorite } = useFavorites()
const { data: allListings } = useListings()

const favoriteListings = computed<PropertyListing[]>(() => {
  if (!allListings.value) return []
  return allListings.value.filter(l => favoriteIds.value.includes(l.id))
})

function formatPrice(n: number): string {
  return n.toLocaleString('pl-PL')
}
</script>

<template>
  <div>
    <!-- Hero (shown when no favorites) -->
    <section v-if="!favoriteListings.length" class="favorites-hero">
      <div class="max-w-container mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div class="flex-1">
          <h1 class="text-2xl md:text-3xl font-bold text-dark-text mb-4 leading-tight">
            Twoje ulubione ogłoszenia zawsze pod ręką
          </h1>
          <p class="text-gray-text mb-6 text-sm md:text-base leading-relaxed max-w-lg">
            Przeglądaj ogłoszenia, a te, które zainteresowały Cię najbardziej,
            oznaczaj serduszkiem i dodawaj do nich notatki, aby w każdej chwili do
            nich powrócić.
          </p>
          <BaseButton variant="primary" size="md" tag="nuxt-link" href="/">
            Przeglądaj ogłoszenia
          </BaseButton>
        </div>
        <div class="favorites-hero__illustration flex-shrink-0">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-48 h-48 md:w-56 md:h-56">
            <rect x="30" y="80" width="140" height="100" rx="8" fill="#2563eb" />
            <path d="M20 85 L100 25 L180 85" stroke="#2563eb" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <rect x="80" y="120" width="40" height="60" rx="4" fill="#1e40af" />
            <rect x="50" y="100" width="25" height="25" rx="3" fill="#fff" opacity="0.5" />
            <rect x="125" y="100" width="25" height="25" rx="3" fill="#fff" opacity="0.5" />
            <path d="M100 130 C100 115, 80 110, 80 125 C80 140, 100 155, 100 155 C100 155, 120 140, 120 125 C120 110, 100 115, 100 130Z" fill="#fbbf24" />
          </svg>
        </div>
      </div>
    </section>

    <!-- Favorites list -->
    <section v-else>
      <div class="max-w-container mx-auto px-4 py-8">
        <h1 class="text-xl md:text-2xl font-bold text-dark-text mb-2">
          Ulubione ogłoszenia
        </h1>
        <p class="text-sm text-gray-text mb-6">
          {{ favoriteListings.length }} {{ favoriteListings.length === 1 ? 'ogłoszenie' : favoriteListings.length < 5 ? 'ogłoszenia' : 'ogłoszeń' }}
        </p>

        <div class="space-y-3">
          <div
            v-for="listing in favoriteListings"
            :key="listing.id"
            class="fav-row"
          >
            <NuxtLink :to="`/ogloszenie/${listing.id}`" class="fav-row__link">
              <div class="fav-row__image">
                <img
                  :src="listing.imageUrl"
                  :alt="listing.title"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
              </div>
              <div class="fav-row__body">
                <h3 class="fav-row__title">{{ listing.title }}</h3>
                <p class="fav-row__location">
                  {{ listing.city }}<span v-if="listing.district">, {{ listing.district }}</span>
                </p>
                <div class="fav-row__details">
                  <span class="fav-row__price">
                    {{ formatPrice(listing.price) }} {{ listing.transactionType === 'wynajem' ? 'zł/mies.' : 'zł' }}
                  </span>
                  <span class="fav-row__sep">|</span>
                  <span>{{ listing.area }} m²</span>
                  <span v-if="listing.rooms" class="fav-row__sep">|</span>
                  <span v-if="listing.rooms">{{ listing.rooms }} pok.</span>
                  <span class="fav-row__sep">|</span>
                  <span>{{ formatPrice(listing.pricePerM2) }} zł/m²</span>
                </div>
                <p class="fav-row__agency">{{ listing.agencyName }}</p>
              </div>
            </NuxtLink>
            <button
              class="fav-row__remove"
              aria-label="Usuń z ulubionych"
              @click="toggleFavorite(listing.id)"
            >
              <BaseIcon name="x" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.favorites-hero {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.fav-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding-right: 12px;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  }

  &__link {
    display: flex;
    gap: 12px;
    flex: 1;
    min-width: 0;
    padding: 12px;
    text-decoration: none;
    color: inherit;
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

  &__remove {
    flex-shrink: 0;
    padding: 8px;
    color: #ccc;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #ef4444;
    }
  }
}
</style>
