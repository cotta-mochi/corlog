<script setup lang="ts">
import type { Player } from '@/types'
import { computed, ref } from 'vue'
const {
  player,
  color,
  width = 60,
  checked = false,
} = defineProps<{
  player: Player
  color: { r: number; g: number; b: number }
  width?: number
  checked?: boolean
}>()

const backgroundColor = computed(() => {
  return `rgb(${color.r}, ${color.g}, ${color.b})`
})

const emit = defineEmits<{
  (e: 'change', checked: { player: Player; checked: boolean }): void
}>()
</script>

<template>
  <label
    class="team-player"
    :style="{ backgroundColor: backgroundColor, width: `${width}px` }"
    :class="{ 'team-player--checked': checked }"
  >
    <p class="team-player__number font-roboto text-bold">#{{ player.number }}</p>
    <p class="team-player__alias">{{ player.alias }}</p>
    <input
      type="checkbox"
      :checked="checked"
      @change="emit('change', { player, checked: $event.target.checked })"
    />
  </label>
</template>

<style lang="scss" scoped>
.team-player {
  display: flex;
  flex-direction: column;
  gap: 4px;
  aspect-ratio: 1/1;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  line-height: 1;

  input {
    display: none;
  }

  &--checked {
    background: var(--color-secondary) !important;
  }

  &__number {
    font-size: 1rem;
  }
}
</style>
