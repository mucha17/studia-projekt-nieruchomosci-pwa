<script setup lang="ts">
useHead({ title: 'O nas - Nieruchomości Testowe' })
</script>

<template>
  <div class="max-w-container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-dark-text mb-6">O nas</h1>
    <div class="prose text-sm text-dark-text leading-relaxed max-w-3xl space-y-4">
      <p>Nieruchomosci-testowe.pl to portal ogłoszeniowy umożliwiający przeglądanie i zamieszczanie ofert nieruchomości w całej Polsce.</p>
      <p>Łączymy kupujących, sprzedających, najemców i wynajmujących — od mieszkań i domów, przez działki, po lokale i budynki użytkowe. Współpracujemy z biurami nieruchomości i deweloperami z całego kraju.</p>
      <p>Naszą misją jest ułatwienie procesu poszukiwania wymarzonej nieruchomości dzięki intuicyjnemu wyszukiwaniu, przejrzystym ogłoszeniom i rzetelnym danym rynkowym.</p>
      <h2 class="text-lg font-bold mt-6">Kontakt</h2>
      <p>
        Masz pytania lub propozycje?
        <NuxtLink to="/kontakt" class="text-primary hover:underline">Napisz do nas</NuxtLink>.
      </p>
    </div>
  </div>
</template>
