const STORAGE_PREFIX = 'nieruchomosci-favorites'

const favoriteIds = ref<Set<string>>(new Set())
let loadedForEmail: string | null = null

function storageKey(email: string | null): string {
  return email ? `${STORAGE_PREFIX}-${email.toLowerCase()}` : STORAGE_PREFIX
}

function loadFromStorage(email: string | null) {
  if (typeof window === 'undefined') return
  const key = storageKey(email)
  try {
    const stored = localStorage.getItem(key)
    favoriteIds.value = stored ? new Set(JSON.parse(stored) as string[]) : new Set()
  } catch {
    favoriteIds.value = new Set()
  }
  loadedForEmail = email
}

function saveToStorage(email: string | null) {
  if (typeof window === 'undefined') return
  const key = storageKey(email)
  localStorage.setItem(key, JSON.stringify([...favoriteIds.value]))
}

export function useFavorites() {
  const { currentEmail } = useAuth()

  if (import.meta.client) {
    watch(currentEmail, (email) => {
      loadFromStorage(email)
    }, { immediate: true })
  }

  function isFavorite(id: string): boolean {
    return favoriteIds.value.has(id)
  }

  function toggleFavorite(id: string) {
    if (favoriteIds.value.has(id)) {
      favoriteIds.value.delete(id)
    } else {
      favoriteIds.value.add(id)
    }
    favoriteIds.value = new Set(favoriteIds.value)
    saveToStorage(currentEmail.value)
  }

  const count = computed(() => favoriteIds.value.size)

  const ids = computed(() => [...favoriteIds.value])

  return { isFavorite, toggleFavorite, count, ids }
}
