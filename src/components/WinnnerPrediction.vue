<script setup lang="ts">
import type { Game, Team } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  game: Game
  modelValue: Team['id'] | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Team['id']): void
}>()

const selected = computed({
  get: () => props.modelValue,
  set: (value: Team['id']) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="prediction-winner">
    <label for="prediction-winner-team-1">
      <input
        type="radio"
        id="prediction-winner-team-1"
        name="prediction-winner"
        v-model="selected"
        :value="game.team1.id"
      />
      {{ game.team1.name }}
    </label>
    vs
    <label for="prediction-winner-team-2">
      <input
        type="radio"
        id="prediction-winner-team-2"
        name="prediction-winner"
        v-model="selected"
        :value="game.team2.id"
      />
      {{ game.team2.name }}
    </label>
  </div>
</template>

<style scoped>
.prediction-winner {
  display: flex;
  gap: 10px;
}
</style>
