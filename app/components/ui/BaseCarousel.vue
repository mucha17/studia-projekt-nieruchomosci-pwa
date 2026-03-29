<script setup lang="ts">
interface BaseCarouselProps {
  itemsPerView?: number
  gap?: number
}

const props = withDefaults(defineProps<BaseCarouselProps>(), {
  itemsPerView: 3,
  gap: 16,
})

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateScrollState(): void {
  const el = scrollContainer.value
  if (!el) return

  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function getItemWidth(): number {
  const el = scrollContainer.value
  if (!el) return 0

  const containerWidth = el.clientWidth
  const viewportWidth = window.innerWidth

  let visibleItems: number
  if (viewportWidth < 768) {
    visibleItems = 1
  } else if (viewportWidth < 1024) {
    visibleItems = 2
  } else {
    visibleItems = props.itemsPerView
  }

  return (containerWidth - props.gap * (visibleItems - 1)) / visibleItems + props.gap
}

function scrollPrev(): void {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: -getItemWidth(), behavior: 'smooth' })
}

function scrollNext(): void {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: getItemWidth(), behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
})
</script>

<template>
  <div class="carousel">
    <button
      v-show="canScrollLeft"
      class="carousel__arrow carousel__arrow--left"
      aria-label="Previous"
      @click="scrollPrev"
    >
      <BaseIcon name="arrow-left" :size="20" />
    </button>

    <div
      ref="scrollContainer"
      class="carousel__track"
      :style="{ gap: `${gap}px` }"
      @scroll="updateScrollState"
    >
      <slot />
    </div>

    <button
      v-show="canScrollRight"
      class="carousel__arrow carousel__arrow--right"
      aria-label="Next"
      @click="scrollNext"
    >
      <BaseIcon name="arrow-right" :size="20" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.carousel {
  position: relative;

  &__track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    // Hide scrollbar across browsers
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > :deep(*) {
      scroll-snap-align: start;
      flex-shrink: 0;
      width: calc(
        (100% - v-bind('`${(itemsPerView - 1) * gap}px`')) / v-bind('itemsPerView')
      );

      @media (max-width: $bp-md) {
        width: 100%;
      }

      @media (min-width: $bp-md) and (max-width: $bp-lg) {
        width: calc((100% - v-bind('`${gap}px`')) / 2);
      }
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: $white;
    border: 1px solid $gray-border;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    color: $dark-text;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;

    &:hover {
      background-color: $gray-bg;
      box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }

    &--left {
      left: -18px;
    }

    &--right {
      right: -18px;
    }
  }
}
</style>
