<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="border-t border-gray-700">
    <div class="max-w-container mx-auto px-4 py-4 flex flex-col items-center gap-3 md:flex-row md:justify-between">
      <span class="text-xs text-gray-500">
        Nieruchomosci-testowe.pl Copyright &copy; 2009-{{ currentYear }} STUDIA-PROJEKT
      </span>

      <div class="flex items-center gap-1">
        <BaseIcon
          name="home"
          :size="16"
          color="#2563eb"
        />
        <span class="text-sm text-white">tu zaczyna się dom</span>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
