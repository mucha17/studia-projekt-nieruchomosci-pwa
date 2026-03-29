<script setup lang="ts">
const { isLoggedIn } = useAuth()

// Redirect to login if not authenticated
watch(isLoggedIn, (val) => {
  if (!val) navigateTo('/logowanie')
}, { immediate: true })

useHead({
  title: 'Dodaj ogłoszenie - Nieruchomości Testowe',
})

type TransactionType = 'sprzedaz' | 'wynajem'

interface PropertyCategory {
  id: string
  label: string
  highlighted?: boolean
}

const step = ref<1 | 2>(1)
const selectedTransaction = ref<TransactionType | null>(null)
const selectedCategory = ref<string | null>(null)

const sellCategories: PropertyCategory[] = [
  { id: 'mieszkanie', label: 'Mieszkanie' },
  { id: 'dom', label: 'Dom' },
  { id: 'dzialka', label: 'Działka' },
  { id: 'lokal', label: 'Lokal użytkowy' },
  { id: 'budynek', label: 'Budynek użytkowy' },
]

const rentCategories: PropertyCategory[] = [
  { id: 'mieszkanie', label: 'Mieszkanie', highlighted: true },
  { id: 'pokoj', label: 'Pokój', highlighted: true },
  { id: 'dom', label: 'Dom' },
  { id: 'dzialka', label: 'Działka' },
  { id: 'lokal', label: 'Lokal użytkowy' },
  { id: 'budynek', label: 'Budynek użytkowy' },
]

function selectCategory(transaction: TransactionType, category: string) {
  selectedTransaction.value = transaction
  selectedCategory.value = category
  step.value = 2
}

function goBack() {
  step.value = 1
  selectedTransaction.value = null
  selectedCategory.value = null
}

// Step 2 form state
const form = reactive({
  title: '',
  description: '',
  locationDescription: '',
  price: '',
  area: '',
  rooms: '',
  floor: '',
  floors: '',
  yearBuilt: '',
  city: '',
  district: '',
  street: '',
  heating: '',
  parking: '',
  balcony: false,
  garden: false,
  terrace: false,
  elevator: false,
  basement: false,
  garage: false,
  deposit: '',
  rentPeriod: '',
  availableFrom: '',
  lat: 52.2297 as number | null,
  lng: 21.0122 as number | null,
})

// Location tab
type LocationTab = 'address' | 'map'
const activeLocationTab = ref<LocationTab>('address')

// Map
const mapContainer = ref<HTMLElement | null>(null)
let mapInitialized = false

async function initMap() {
  if (!mapContainer.value || mapInitialized) return
  mapInitialized = true

  const L = (await import('leaflet')).default

  const map = L.map(mapContainer.value).setView(
    [form.lat ?? 52.2297, form.lng ?? 21.0122],
    13
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  // Fix default marker icon path issue with bundlers
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const marker = L.marker([form.lat ?? 52.2297, form.lng ?? 21.0122], {
    draggable: true,
    icon: defaultIcon,
  }).addTo(map)

  marker.on('dragend', () => {
    const pos = marker.getLatLng()
    form.lat = pos.lat
    form.lng = pos.lng
  })

  map.on('click', (e: L.LeafletMouseEvent) => {
    marker.setLatLng(e.latlng)
    form.lat = e.latlng.lat
    form.lng = e.latlng.lng
  })
}

watch(activeLocationTab, (tab) => {
  if (tab === 'map') {
    nextTick(() => initMap())
  }
})

function handleSubmit() {
  // Mock submit
}

const isRent = computed(() => selectedTransaction.value === 'wynajem')

const transactionLabel = computed(() =>
  isRent.value ? 'Wynajmę' : 'Sprzedam'
)

const formHeading = computed(() =>
  isRent.value ? 'Wynajem nieruchomości' : 'Sprzedaż nieruchomości'
)

const priceLabel = computed(() =>
  isRent.value ? 'Czynsz miesięczny (PLN)' : 'Cena (PLN)'
)

const categoryLabel = computed(() => {
  const all = [...sellCategories, ...rentCategories]
  return all.find(c => c.id === selectedCategory.value)?.label ?? ''
})
</script>

<template>
  <div class="add-listing">
    <!-- Step 1: Category selection -->
    <div v-if="step === 1" class="add-listing__step1">
      <div class="max-w-container mx-auto px-4 py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <!-- Sprzedam panel -->
          <div class="category-panel">
            <div class="category-panel__header">
              <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <h2 class="category-panel__title">Sprzedam</h2>
            </div>
            <div class="category-panel__buttons">
              <button
                v-for="cat in sellCategories"
                :key="cat.id"
                class="category-btn"
                @click="selectCategory('sprzedaz', cat.id)"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Wynajmę panel -->
          <div class="category-panel">
            <div class="category-panel__header">
              <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <h2 class="category-panel__title">Wynajmę</h2>
            </div>
            <div class="category-panel__buttons">
              <button
                v-for="cat in rentCategories"
                :key="cat.id"
                class="category-btn"
                :class="{ 'category-btn--highlighted': cat.highlighted }"
                @click="selectCategory('wynajem', cat.id)"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom links -->
        <div class="mt-8 flex flex-col sm:flex-row justify-between max-w-3xl mx-auto text-sm text-gray-text">
          <p>
            Masz biuro nieruchomości?
            <NuxtLink to="/kontakt" class="text-dark-text underline hover:no-underline">Dołącz do nas</NuxtLink>
          </p>
          <p>
            Jesteś deweloperem?
            <NuxtLink to="/kontakt" class="text-dark-text underline hover:no-underline">Dodaj inwestycję</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Step 2: Listing form -->
    <div v-else class="add-listing__step2">
      <div class="max-w-container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Main form -->
          <div class="flex-1">
            <div class="form-section">
              <div class="flex items-center gap-2 mb-6">
                <button class="text-gray-text hover:text-dark-text" @click="goBack">
                  <BaseIcon name="chevron-left" :size="20" />
                </button>
                <h1 class="text-lg font-bold text-dark-text">
                  {{ formHeading }}
                </h1>
              </div>

              <form @submit.prevent="handleSubmit">
                <!-- Basic info -->
                <fieldset class="form-fieldset">
                  <div class="form-row">
                    <label class="form-label">Tytuł ogłoszenia</label>
                    <input v-model="form.title" type="text" class="form-input" />
                  </div>

                  <div class="form-row">
                    <label class="form-label">Opis nieruchomości</label>
                    <textarea v-model="form.description" class="form-input form-input--textarea" rows="4" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-row">
                      <label class="form-label">{{ priceLabel }}</label>
                      <input v-model="form.price" type="number" class="form-input" />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Powierzchnia (m²)</label>
                      <input v-model="form.area" type="number" class="form-input" />
                    </div>
                  </div>

                  <!-- Rent-specific fields -->
                  <div v-if="isRent" class="grid grid-cols-3 gap-4">
                    <div class="form-row">
                      <label class="form-label">Kaucja (PLN)</label>
                      <input v-model="form.deposit" type="number" class="form-input" />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Okres najmu</label>
                      <select v-model="form.rentPeriod" class="form-input">
                        <option value="">Wybierz</option>
                        <option value="dowolny">Dowolny</option>
                        <option value="rok">Rok</option>
                        <option value="pol-roku">Pół roku</option>
                        <option value="miesiac">Miesiąc</option>
                      </select>
                    </div>
                    <div class="form-row">
                      <label class="form-label">Dostępne od</label>
                      <input v-model="form.availableFrom" type="date" class="form-input" />
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div class="form-row">
                      <label class="form-label">Liczba pokoi</label>
                      <input v-model="form.rooms" type="number" class="form-input" />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Piętro</label>
                      <input v-model="form.floor" type="number" class="form-input" />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Liczba pięter</label>
                      <input v-model="form.floors" type="number" class="form-input" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-row">
                      <label class="form-label">Rok budowy</label>
                      <input v-model="form.yearBuilt" type="number" class="form-input" />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Ogrzewanie</label>
                      <select v-model="form.heating" class="form-input">
                        <option value="">Wybierz</option>
                        <option value="miejskie">Miejskie</option>
                        <option value="gazowe">Gazowe</option>
                        <option value="elektryczne">Elektryczne</option>
                        <option value="inne">Inne</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row">
                    <label class="form-label">Parking</label>
                    <div class="flex gap-4">
                      <label class="form-radio">
                        <input v-model="form.parking" type="radio" value="tak" /> Tak
                      </label>
                      <label class="form-radio">
                        <input v-model="form.parking" type="radio" value="nie" /> Nie
                      </label>
                    </div>
                  </div>
                </fieldset>

                <!-- Photos -->
                <fieldset class="form-fieldset">
                  <legend class="form-legend">Zdjęcia</legend>
                  <p class="text-xs text-gray-text mb-3">
                    Dodaj do 12 zdjęć nieruchomości w formacie JPG lub PNG (maks. 5 MB każde)
                  </p>
                  <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    <div
                      v-for="i in 12"
                      :key="i"
                      class="photo-slot"
                    >
                      <BaseIcon name="plus" :size="20" class="text-gray-300" />
                    </div>
                  </div>
                </fieldset>

                <!-- Plans -->
                <fieldset class="form-fieldset">
                  <legend class="form-legend">Plany</legend>
                  <div class="grid grid-cols-4 gap-2">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="photo-slot"
                    >
                      <BaseIcon name="plus" :size="20" class="text-gray-300" />
                    </div>
                  </div>
                </fieldset>

                <!-- Location -->
                <fieldset class="form-fieldset">
                  <legend class="form-legend">Lokalizacja</legend>

                  <div class="flex gap-2 mb-4">
                    <button
                      type="button"
                      class="form-tab"
                      :class="{ 'form-tab--active': activeLocationTab === 'address' }"
                      @click="activeLocationTab = 'address'"
                    >
                      Adres
                    </button>
                    <button
                      type="button"
                      class="form-tab"
                      :class="{ 'form-tab--active': activeLocationTab === 'map' }"
                      @click="activeLocationTab = 'map'"
                    >
                      Mapa
                    </button>
                  </div>

                  <!-- Address tab -->
                  <div v-show="activeLocationTab === 'address'">
                    <div class="form-row">
                      <label class="form-label">Opis lokalizacji</label>
                      <textarea v-model="form.locationDescription" class="form-input form-input--textarea" rows="3" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="form-row">
                        <label class="form-label">Miejscowość</label>
                        <input v-model="form.city" type="text" class="form-input" />
                      </div>
                      <div class="form-row">
                        <label class="form-label">Dzielnica</label>
                        <input v-model="form.district" type="text" class="form-input" />
                      </div>
                    </div>

                    <div class="form-row">
                      <label class="form-label">Ulica</label>
                      <input v-model="form.street" type="text" class="form-input" />
                    </div>
                  </div>

                  <!-- Map tab -->
                  <div v-show="activeLocationTab === 'map'">
                    <p class="text-xs text-gray-text mb-3">
                      Kliknij na mapie, aby wybrać lokalizację nieruchomości. Możesz też przeciągnąć marker.
                    </p>
                    <div
                      ref="mapContainer"
                      class="map-container"
                    />
                    <div v-if="form.lat && form.lng" class="mt-2 text-xs text-gray-text">
                      Współrzędne: {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
                    </div>
                  </div>
                </fieldset>

                <!-- Features -->
                <fieldset class="form-fieldset">
                  <legend class="form-legend">Cechy dodatkowe</legend>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label class="form-checkbox">
                      <input v-model="form.balcony" type="checkbox" />
                      <span>Balkon</span>
                    </label>
                    <label class="form-checkbox">
                      <input v-model="form.garden" type="checkbox" />
                      <span>Ogród</span>
                    </label>
                    <label class="form-checkbox">
                      <input v-model="form.terrace" type="checkbox" />
                      <span>Taras</span>
                    </label>
                    <label class="form-checkbox">
                      <input v-model="form.elevator" type="checkbox" />
                      <span>Winda</span>
                    </label>
                    <label class="form-checkbox">
                      <input v-model="form.basement" type="checkbox" />
                      <span>Piwnica</span>
                    </label>
                    <label class="form-checkbox">
                      <input v-model="form.garage" type="checkbox" />
                      <span>Garaż</span>
                    </label>
                  </div>
                </fieldset>

                <div class="flex justify-center mt-8">
                  <BaseButton variant="primary" size="lg" class="px-12">
                    Dalej
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:w-72 flex-shrink-0">
            <div class="sidebar-card">
              <div class="sidebar-card__preview">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <BaseIcon name="building" :size="28" class="text-gray-300" />
                </div>
                <p class="text-xs text-gray-text text-center">Podgląd</p>
              </div>

              <div class="sidebar-card__info mt-4">
                <p class="text-xs text-gray-text mb-1">Oferta</p>
                <p class="text-sm font-medium text-dark-text">
                  {{ transactionLabel }} — {{ categoryLabel }}
                </p>
              </div>

              <div class="sidebar-card__pricing mt-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-10 h-10" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#dbeafe" />
                    <path d="M16 32 L24 16 L32 32" stroke="#2563eb" stroke-width="2" fill="none" />
                    <circle cx="24" cy="28" r="2" fill="#2563eb" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-text">Publikacja</p>
                    <p class="text-sm font-semibold text-dark-text">Bezpłatnie</p>
                  </div>
                </div>
              </div>

              <BaseButton variant="primary" size="md" class="w-full mt-4">
                Opublikuj ogłoszenie
              </BaseButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-listing {
  background: #f3f4f6;
  min-height: calc(100vh - 52px);
}

// Step 1
.category-panel {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.category-btn {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: #fff;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  &--highlighted {
    border-color: #2563eb;
    color: #2563eb;
    font-weight: 500;
  }
}

// Step 2
.form-section {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0 0 32px;
}

.form-legend {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: block;
}

.form-row {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #2563eb;
  }

  &--textarea {
    resize: vertical;
  }
}

.form-radio,
.form-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #1a1a1a;
  cursor: pointer;
}

.form-tab {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #666;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;

  &--active {
    background: #f3f4f6;
    color: #1a1a1a;
    border-color: #e5e7eb;
  }
}

.photo-slot {
  aspect-ratio: 1;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: #2563eb;
  }
}

.map-container {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  z-index: 0;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
  position: sticky;
  top: 68px;

  &__preview {
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
  }
}
</style>
