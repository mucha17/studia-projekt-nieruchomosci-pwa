<script setup lang="ts">
interface BaseCardProps {
  hoverable?: boolean
  padding?: boolean
}

withDefaults(defineProps<BaseCardProps>(), {
  hoverable: false,
  padding: true,
})
</script>

<template>
  <div
    class="bg-white rounded-md border border-gray-border overflow-hidden"
    :class="{
      'hover:shadow-md transition-shadow': hoverable,
      'p-4': padding,
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
</style>
