<script setup lang="ts">
import type { Investment, InvestmentStatus } from '~/server/types/investment'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: investment, pending, error } = useFetch<Investment>(() => `/api/investments/${id.value}`)

useHead({
  title: computed(() => investment.value
    ? `${investment.value.name} - Nieruchomości Testowe`
    : 'Inwestycja - Nieruchomości Testowe'),
})

const statusLabels: Record<InvestmentStatus, string> = {
  'nowa': 'Nowa inwestycja',
  'w-budowie': 'W budowie',
  'gotowa': 'Gotowa do odbioru',
  'w-sprzedazy': 'W sprzedaży',
}

const statusColors: Record<InvestmentStatus, string> = {
  'nowa': 'bg-green-100 text-green-700',
  'w-budowie': 'bg-yellow-100 text-yellow-700',
  'gotowa': 'bg-blue-100 text-blue-700',
  'w-sprzedazy': 'bg-blue-100 text-blue-700',
}
</script>

<template>
  <div class="investment-page">
    <div v-if="pending" class="text-center py-16 text-gray-text">
      Ładowanie inwestycji...
    </div>

    <div v-else-if="error || !investment" class="text-center py-16">
      <p class="text-gray-text text-lg mb-4">Inwestycja nie została znaleziona</p>
      <BaseButton variant="primary" tag="nuxt-link" href="/inwestycje">
        Zobacz wszystkie inwestycje
      </BaseButton>
    </div>

    <template v-else>
      <!-- Breadcrumbs -->
      <div class="bg-gray-50 border-b border-gray-200">
        <div class="max-w-container mx-auto px-4 py-3 text-xs text-gray-text flex items-center gap-1.5">
          <NuxtLink to="/" class="hover:text-primary">Strona główna</NuxtLink>
          <span>/</span>
          <NuxtLink to="/inwestycje" class="hover:text-primary">Inwestycje</NuxtLink>
          <span>/</span>
          <span class="text-dark-text">{{ investment.name }}</span>
        </div>
      </div>

      <div class="max-w-container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Main -->
          <div class="flex-1">
            <!-- Title -->
            <div class="mb-4">
              <h1 class="text-xl md:text-2xl font-bold text-dark-text">
                {{ investment.name }}
              </h1>
              <p class="text-sm text-gray-text mt-1 capitalize">
                {{ investment.cityName }}, {{ investment.regionName }}
              </p>
              <span
                class="inline-block text-xs font-medium px-2.5 py-1 rounded mt-2"
                :class="statusColors[investment.status]"
              >
                {{ statusLabels[investment.status] }}
              </span>
            </div>

            <!-- Photo -->
            <div class="investment-photo mb-6">
              <img
                :src="investment.imageUrl"
                :alt="investment.name"
                class="w-full h-full object-cover"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
            </div>

            <!-- Key stats -->
            <div class="stats-row mb-6">
              <div class="stat-item">
                <BaseIcon name="home" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ investment.category }}</p>
                  <p class="stat-item__label">Typ</p>
                </div>
              </div>
              <div class="stat-item">
                <BaseIcon name="arrows" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ investment.areaRange }}</p>
                  <p class="stat-item__label">Powierzchnia</p>
                </div>
              </div>
              <div class="stat-item">
                <BaseIcon name="map-pin" :size="20" class="text-gray-400" />
                <div>
                  <p class="stat-item__value">{{ investment.cityName }}</p>
                  <p class="stat-item__label">Lokalizacja</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-dark-text mb-3">O inwestycji</h2>
              <p class="text-sm text-dark-text leading-relaxed mb-3">
                {{ investment.name }} to nowoczesna inwestycja deweloperska zlokalizowana w {{ investment.cityName }} (woj. {{ investment.regionName }}). Oferujemy {{ investment.category.toLowerCase() }} o powierzchni {{ investment.areaRange }}.
              </p>
              <p class="text-sm text-dark-text leading-relaxed">
                Inwestycja wyróżnia się przemyślaną architekturą, wysokiej jakości materiałami wykończeniowymi oraz doskonałą lokalizacją z pełną infrastrukturą w pobliżu. Teren osiedla jest ogrodzony i monitorowany, z dostępem do podziemnego parkingu.
              </p>
            </div>

            <!-- Details -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-dark-text mb-3">Szczegóły</h2>
              <table class="details-table">
                <tbody>
                  <tr>
                    <td>Nazwa inwestycji</td>
                    <td>{{ investment.name }}</td>
                  </tr>
                  <tr>
                    <td>Miasto</td>
                    <td>{{ investment.cityName }}</td>
                  </tr>
                  <tr>
                    <td>Województwo</td>
                    <td class="capitalize">{{ investment.regionName }}</td>
                  </tr>
                  <tr>
                    <td>Typ</td>
                    <td>{{ investment.category }}</td>
                  </tr>
                  <tr>
                    <td>Powierzchnia</td>
                    <td>{{ investment.areaRange }}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{{ statusLabels[investment.status] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:w-80 flex-shrink-0">
            <div class="sidebar">
              <h3 class="text-sm font-bold text-dark-text mb-3">Zapytaj o inwestycję</h3>
              <input type="text" placeholder="Imię i nazwisko" class="sidebar__input" />
              <input type="email" placeholder="Adres e-mail" class="sidebar__input" />
              <input type="tel" placeholder="Numer telefonu" class="sidebar__input" />
              <textarea placeholder="Wiadomość" rows="3" class="sidebar__input sidebar__input--textarea" />
              <BaseButton variant="primary" size="md" class="w-full">
                Skontaktuj się
              </BaseButton>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.investment-page {
  background: #fff;
}

.investment-photo {
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
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
  padding: 20px;
  position: sticky;
  top: 68px;

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
