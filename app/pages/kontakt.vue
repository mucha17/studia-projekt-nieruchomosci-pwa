<script setup lang="ts">
useHead({ title: 'Kontakt - Nieruchomości Testowe' })

const form = reactive({
  name: '',
  email: '',
  message: '',
})
const sent = ref(false)

function handleSubmit() {
  sent.value = true
}
</script>

<template>
  <div class="max-w-container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-dark-text mb-2">Kontakt</h1>
    <p class="text-sm text-gray-text mb-8">Masz pytania? Napisz do nas.</p>

    <div class="max-w-lg">
      <div v-if="sent" class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p class="text-green-700 font-medium">Wiadomość została wysłana. Dziękujemy!</p>
      </div>

      <form v-else class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-dark-text mb-1">Imię i nazwisko</label>
          <input v-model="form.name" type="text" required class="contact-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-dark-text mb-1">Adres e-mail</label>
          <input v-model="form.email" type="email" required class="contact-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-dark-text mb-1">Wiadomość</label>
          <textarea v-model="form.message" rows="5" required class="contact-input" />
        </div>
        <BaseButton variant="primary" size="md">Wyślij wiadomość</BaseButton>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.15s;
  resize: vertical;

  &:focus {
    border-color: #2563eb;
  }
}
</style>
