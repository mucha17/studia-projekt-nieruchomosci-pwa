<script setup lang="ts">
const { isLoggedIn, logout } = useAuth()
const { count: favCount } = useFavorites()
const isMobileMenuOpen = ref(false)

function handleLogout() {
  logout()
  navigateTo('/')
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-border">
    <div class="max-w-container mx-auto px-4 flex items-center justify-between h-[52px]">
      <!-- Left group: hamburger + logo -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center text-dark-text hover:text-charcoal"
          aria-label="Otwórz menu"
          @click="toggleMobileMenu"
        >
          <BaseIcon name="menu" :size="20" />
        </button>
        <BaseIcon name="home" :size="22" color="#2563eb" />
        <NuxtLink
          to="/"
          class="header__logo font-bold text-dark-text text-base leading-none"
        >
          nieruchomosci-testowe.pl
        </NuxtLink>
      </div>

      <!-- Right group: utility links -->
      <div class="flex items-center gap-5">
        <NuxtLink
          v-if="isLoggedIn"
          to="/ulubione"
          class="header__link hidden sm:flex items-center gap-1.5"
        >
          <BaseIcon name="heart" :size="16" />
          <span>Ulubione<template v-if="favCount > 0"> ({{ favCount }})</template></span>
        </NuxtLink>
        <NuxtLink
          to="/dodaj-ogloszenie"
          class="header__link hidden sm:flex items-center"
        >
          <span>Dodaj ogłoszenie</span>
        </NuxtLink>
        <template v-if="isLoggedIn">
          <button
            class="header__link flex items-center gap-1.5"
            @click="handleLogout"
          >
            <BaseIcon name="user" :size="16" />
            <span>Wyloguj</span>
          </button>
        </template>
        <NuxtLink
          v-else
          to="/logowanie"
          class="header__link flex items-center gap-1.5"
        >
          <BaseIcon name="user" :size="16" />
          <span>Zaloguj</span>
        </NuxtLink>
      </div>
    </div>
  </header>
  <HeaderMobile :is-open="isMobileMenuOpen" @close="closeMobileMenu" />
</template>

<style lang="scss" scoped>
header {
  box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
}

.header__logo {
  text-decoration: none;
  letter-spacing: -0.01em;

  &:hover {
    text-decoration: none;
  }
}

.header__link {
  font-size: 0.8125rem;
  color: #1a1a1a;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s;

  &:hover {
    color: #1a1a1a;
    text-decoration: none;
  }
}
</style>
