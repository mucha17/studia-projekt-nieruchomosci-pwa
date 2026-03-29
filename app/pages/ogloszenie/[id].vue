<script setup lang="ts">
import type { PropertyListing } from '~/server/types/listing'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: listing, pending, error } = useFetch<PropertyListing>(() => `/api/listings/${id.value}`)
const { isLoggedIn } = useAuth()
const { isFavorite, toggleFavorite } = useFavorites()

useHead({
  title: computed(() => listing.value ? `${listing.value.title} - Nieruchomości Testowe` : 'Ogłoszenie - Nieruchomości Testowe'),
})

function formatPrice(n: number): string {
  return n.toLocaleString('pl-PL')
}

const transactionLabel = computed(() =>
  listing.value?.transactionType === 'wynajem' ? 'Wynajem' : 'Sprzedaż'
)

const typeLabel = computed(() => {
  const map: Record<string, string> = {
    mieszkanie: 'Mieszkanie',
    pokoj: 'Pokój',
    dom: 'Dom',
    dzialka: 'Działka',
    lokal: 'Lokal użytkowy',
    budynek: 'Budynek użytkowy',
  }
  return map[listing.value?.type ?? ''] ?? ''
})

const priceUnit = computed(() =>
  listing.value?.transactionType === 'wynajem' ? 'zł/mies.' : 'zł'
)

// Mock description
const description = computed(() => {
  if (!listing.value) return ''
  const l = listing.value
  const parts = [
    `Prezentujemy ${typeLabel.value.toLowerCase()} na ${transactionLabel.value.toLowerCase()} w miejscowości ${l.city}${l.district ? `, dzielnica ${l.district}` : ''}.`,
    `Nieruchomość o powierzchni ${l.area} m²${l.rooms ? `, ${l.rooms} ${l.rooms === 1 ? 'pokój' : l.rooms < 5 ? 'pokoje' : 'pokoi'}` : ''}.`,
    'Obiekt w bardzo dobrym stanie technicznym, gotowy do zamieszkania. Doskonała lokalizacja z pełną infrastrukturą w pobliżu — sklepy, szkoły, komunikacja miejska.',
    'Zapraszamy na prezentację!',
  ]
  return parts.join(' ')
})
</script>

<template>
  <div class="listing-page">
    <!-- Loading -->
    <div v-if="pending" class="text-center py-16 text-gray-text">
      Ładowanie ogłoszenia...
    </div>

    <!-- Not found -->
    <div v-else-if="error || !listing" class="text-center py-16">
      <p class="text-gray-text text-lg mb-4">Ogłoszenie nie zostało znalezione</p>
      <BaseButton variant="primary" tag="nuxt-link" href="/">
        Wróć na stronę główną
      </BaseButton>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Breadcrumbs -->
      <div class="bg-gray-50 border-b border-gray-200">
        <div class="max-w-container mx-auto px-4 py-3 text-xs text-gray-text flex items-center gap-1.5">
          <NuxtLink to="/" class="hover:text-primary">Strona główna</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/miasto/${listing.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')}`" class="hover:text-primary">
            {{ listing.city }}
          </NuxtLink>
          <span>/</span>
          <span class="text-dark-text">{{ listing.title }}</span>
        </div>
      </div>

      <div class="max-w-container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Main column -->
          <div class="flex-1">
            <!-- Title + location -->
            <div class="mb-4">
              <h1 class="text-xl md:text-2xl font-bold text-dark-text">
                {{ listing.title }}
              </h1>
              <p class="text-sm text-gray-text mt-1">
                {{ listing.city }}<span v-if="listing.district">, {{ listing.district }}</span>
              </p>
            </div>

            <!-- Photo -->
            <div class="listing-photo mb-6">
              <img
                :src="listing.imageUrl"
                :alt="listing.title"
                class="w-full h-full object-cover"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
              <button
                v-if="isLoggedIn"
                class="listing-photo__fav"
                :class="{ 'listing-photo__fav--active': isFavorite(listing.id) }"
                aria-label="Dodaj do ulubionych"
                @click="toggleFavorite(listing.id)"
              >
                <BaseIcon name="heart" :size="20" />
              </button>
            </div>

            <!-- Key stats -->
            <div class="stats-row mb-6">
              <div class="stat-item">
                <BaseIcon name="home" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ typeLabel }}</p>
                  <p class="stat-item__label">Typ</p>
                </div>
              </div>
              <div class="stat-item">
                <BaseIcon name="arrows" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ listing.area }} m²</p>
                  <p class="stat-item__label">Powierzchnia</p>
                </div>
              </div>
              <div v-if="listing.rooms" class="stat-item">
                <BaseIcon name="building" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ listing.rooms }}</p>
                  <p class="stat-item__label">{{ listing.rooms === 1 ? 'Pokój' : listing.rooms < 5 ? 'Pokoje' : 'Pokoi' }}</p>
                </div>
              </div>
              <div class="stat-item">
                <BaseIcon name="map-pin" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ listing.city }}</p>
                  <p class="stat-item__label">Lokalizacja</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-dark-text mb-3">Opis</h2>
              <p class="text-sm text-dark-text leading-relaxed">
                {{ description }}
              </p>
            </div>

            <!-- Details table -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-dark-text mb-3">Szczegóły oferty</h2>
              <table class="details-table">
                <tbody>
                  <tr>
                    <td>Typ transakcji</td>
                    <td>{{ transactionLabel }}</td>
                  </tr>
                  <tr>
                    <td>Typ nieruchomości</td>
                    <td>{{ typeLabel }}</td>
                  </tr>
                  <tr>
                    <td>Cena</td>
                    <td>{{ formatPrice(listing.price) }} {{ priceUnit }}</td>
                  </tr>
                  <tr>
                    <td>Powierzchnia</td>
                    <td>{{ listing.area }} m²</td>
                  </tr>
                  <tr>
                    <td>Cena za m²</td>
                    <td>{{ formatPrice(listing.pricePerM2) }} zł/m²</td>
                  </tr>
                  <tr v-if="listing.rooms">
                    <td>Liczba pokoi</td>
                    <td>{{ listing.rooms }}</td>
                  </tr>
                  <tr>
                    <td>Miasto</td>
                    <td>{{ listing.city }}</td>
                  </tr>
                  <tr v-if="listing.district">
                    <td>Dzielnica</td>
                    <td>{{ listing.district }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:w-80 flex-shrink-0">
            <div class="sidebar">
              <!-- Price box -->
              <div class="sidebar__price">
                <p class="text-2xl font-bold text-dark-text">
                  {{ formatPrice(listing.price) }} {{ priceUnit }}
                </p>
                <p class="text-sm text-gray-text">
                  {{ formatPrice(listing.pricePerM2) }} zł/m²
                </p>
              </div>

              <!-- Agency -->
              <div class="sidebar__agency">
                <p class="text-xs text-gray-text mb-1">Biuro nieruchomości</p>
                <p class="text-sm font-semibold text-dark-text">{{ listing.agencyName }}</p>
              </div>

              <!-- Contact form -->
              <div class="sidebar__contact">
                <h3 class="text-sm font-bold text-dark-text mb-3">Skontaktuj się</h3>
                <input
                  type="text"
                  placeholder="Imię i nazwisko"
                  class="sidebar__input"
                />
                <input
                  type="email"
                  placeholder="Adres e-mail"
                  class="sidebar__input"
                />
                <input
                  type="tel"
                  placeholder="Numer telefonu"
                  class="sidebar__input"
                />
                <textarea
                  placeholder="Wiadomość"
                  rows="3"
                  class="sidebar__input sidebar__input--textarea"
                />
                <BaseButton variant="primary" size="md" class="w-full">
                  Skontaktuj się
                </BaseButton>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.listing-page {
  background: #fff;
}

.listing-photo {
  position: relative;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;

  &__fav {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #2563eb;
    }

    &--active {
      color: #2563eb;
    }
  }
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;

  &__value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  &__label {
    font-size: 0.6875rem;
    color: #999;
  }
}

.details-table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 10px 0;
    font-size: 0.875rem;
    border-bottom: 1px solid #f3f4f6;

    &:first-child {
      color: #666;
      width: 40%;
    }

    &:last-child {
      color: #1a1a1a;
      font-weight: 500;
    }
  }
}

.sidebar {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 68px;

  &__price {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__agency {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__contact {
    padding: 20px;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #1a1a1a;
    outline: none;
    margin-bottom: 10px;
    transition: border-color 0.15s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #2563eb;
    }

    &--textarea {
      resize: vertical;
    }
  }
}
</style>
