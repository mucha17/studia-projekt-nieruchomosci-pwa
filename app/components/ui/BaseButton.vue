<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonTag = 'button' | 'a' | 'nuxt-link'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  tag?: ButtonTag
  href?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  disabled: false,
})

const componentTag = computed(() => {
  if (props.tag === 'nuxt-link') return resolveComponent('NuxtLink')
  return props.tag
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-white hover:bg-primary-hover'
    case 'secondary':
      return 'bg-charcoal text-white hover:bg-charcoal/90'
    case 'outline':
      return 'border border-gray-border text-dark-text hover:bg-gray-bg'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-base'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return ''
  }
})

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  variantClasses.value,
  sizeClasses.value,
  { 'opacity-50 cursor-not-allowed pointer-events-none': props.disabled },
])

const bindProps = computed(() => {
  const attrs: Record<string, unknown> = {}

  if (props.tag === 'nuxt-link' && props.href) {
    attrs.to = props.href
  } else if (props.tag === 'a' && props.href) {
    attrs.href = props.href
  }

  if (props.tag === 'button') {
    attrs.disabled = props.disabled
  }

  return attrs
})
</script>

<template>
  <component
    :is="componentTag"
    :class="buttonClasses"
    v-bind="bindProps"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
</style>
