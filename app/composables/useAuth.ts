interface StoredAccount {
  email: string
  password: string
}

interface AuthState {
  loggedInEmail: string | null
}

const ACCOUNTS_KEY = 'nieruchomosci-accounts'
const AUTH_KEY = 'nieruchomosci-auth'

const authState = reactive<AuthState>({
  loggedInEmail: null,
})

let initialized = false

function loadAuth() {
  if (initialized || typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as AuthState
      authState.loggedInEmail = parsed.loggedInEmail
    }
  } catch {
    // ignore
  }
  initialized = true
}

function saveAuth() {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEY, JSON.stringify({ loggedInEmail: authState.loggedInEmail }))
}

function getAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY)
    return stored ? (JSON.parse(stored) as StoredAccount[]) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function useAuth() {
  if (import.meta.client) {
    loadAuth()
  }

  const isLoggedIn = computed(() => authState.loggedInEmail !== null)
  const currentEmail = computed(() => authState.loggedInEmail)

  function register(email: string, password: string): { success: boolean; error?: string } {
    const accounts = getAccounts()
    if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Konto z tym adresem e-mail już istnieje' }
    }
    accounts.push({ email, password })
    saveAccounts(accounts)
    authState.loggedInEmail = email
    saveAuth()
    return { success: true }
  }

  function login(email: string, password: string): { success: boolean; error?: string } {
    const accounts = getAccounts()
    const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (!account) {
      return { success: false, error: 'Nie znaleziono konta z tym adresem e-mail' }
    }
    if (account.password !== password) {
      return { success: false, error: 'Nieprawidłowe hasło' }
    }
    authState.loggedInEmail = account.email
    saveAuth()
    return { success: true }
  }

  function logout() {
    authState.loggedInEmail = null
    saveAuth()
  }

  return { isLoggedIn, currentEmail, register, login, logout }
}
