<script setup lang="ts">
useHead({
  title: 'Rejestracja - Nieruchomości Testowe',
})

const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
})

const { register, isLoggedIn } = useAuth()
const errorMsg = ref('')

const passwordMismatch = computed(() =>
  form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm
)

watch(isLoggedIn, (val) => {
  if (val) navigateTo('/')
}, { immediate: true })

function handleSubmit() {
  errorMsg.value = ''
  if (!form.email || !form.password || !form.passwordConfirm) {
    errorMsg.value = 'Wypełnij wszystkie pola'
    return
  }
  if (form.password !== form.passwordConfirm) {
    errorMsg.value = 'Hasła nie są identyczne'
    return
  }
  if (!form.acceptTerms) {
    errorMsg.value = 'Zaakceptuj regulamin'
    return
  }
  const result = register(form.email, form.password)
  if (!result.success) {
    errorMsg.value = result.error ?? 'Błąd rejestracji'
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-card__title">Utwórz konto</h1>
      <p class="register-card__subtitle">
        Zarejestruj się w Nieruchomosci-testowe.pl
      </p>

      <form class="register-card__form" @submit.prevent="handleSubmit">
        <input
          v-model="form.email"
          type="email"
          placeholder="Adres e-mail"
          class="register-card__input"
          autocomplete="email"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Hasło"
          class="register-card__input"
          autocomplete="new-password"
          required
        />

        <div>
          <input
            v-model="form.passwordConfirm"
            type="password"
            placeholder="Powtórz hasło"
            class="register-card__input"
            :class="{ 'register-card__input--error': passwordMismatch }"
            autocomplete="new-password"
            required
          />
          <p v-if="passwordMismatch" class="register-card__error">
            Hasła nie są identyczne
          </p>
        </div>

        <label class="register-card__terms">
          <input v-model="form.acceptTerms" type="checkbox" required />
          <span>
            Akceptuję
            <NuxtLink to="/regulamin" class="text-primary hover:underline">regulamin</NuxtLink>
            i
            <NuxtLink to="/polityka-prywatnosci" class="text-primary hover:underline">politykę prywatności</NuxtLink>
          </span>
        </label>

        <p v-if="errorMsg" class="register-card__error">{{ errorMsg }}</p>

        <BaseButton variant="primary" size="lg" class="w-full">
          Zarejestruj się
        </BaseButton>
      </form>

      <p class="register-card__login">
        Masz już konto?
        <NuxtLink to="/logowanie" class="text-primary hover:underline">
          Zaloguj się
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-page {
  background-color: #e5e5e5;
  min-height: calc(100vh - 52px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 16px;
}

.register-card {
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

    &--error {
      border-color: #ef4444;

      &:focus {
        border-color: #ef4444;
      }
    }
  }

  &__error {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 4px;
  }

  &__terms {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.8125rem;
    color: #666;
    cursor: pointer;

    input {
      margin-top: 2px;
    }
  }

  &__login {
    text-align: center;
    font-size: 0.875rem;
    color: #666;
    margin-top: 20px;
  }
}
</style>
