<script setup lang="ts">
useHead({
  title: 'Logowanie - Nieruchomości Testowe',
})

const { login, isLoggedIn } = useAuth()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

// Redirect if already logged in
watch(isLoggedIn, (val) => {
  if (val) navigateTo('/')
}, { immediate: true })

function handleSubmit() {
  errorMsg.value = ''
  if (!email.value || !password.value) {
    errorMsg.value = 'Wypełnij wszystkie pola'
    return
  }
  const result = login(email.value, password.value)
  if (!result.success) {
    errorMsg.value = result.error ?? 'Błąd logowania'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-card__title">Zaloguj się</h1>
      <p class="login-card__subtitle">
        Podaj login do konta w Nieruchomosci-testowe.pl
      </p>

      <form class="login-card__form" @submit.prevent="handleSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="Adres e-mail"
          class="login-card__input"
          autocomplete="email"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Hasło"
          class="login-card__input"
          autocomplete="current-password"
        />

        <p v-if="errorMsg" class="login-card__error">{{ errorMsg }}</p>

        <BaseButton variant="primary" size="lg" class="w-full">
          Zaloguj się
        </BaseButton>
      </form>

      <BaseButton
        variant="outline"
        size="lg"
        class="w-full mt-3"
        tag="nuxt-link"
        href="/rejestracja"
      >
        Utwórz konto
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  background-color: #e5e5e5;
  min-height: calc(100vh - 52px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 16px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    text-align: center;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
    margin-bottom: 28px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 0;
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9375rem;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #2563eb;
    }
  }

  &__error {
    font-size: 0.8125rem;
    color: #ef4444;
    text-align: center;
  }
}
</style>
