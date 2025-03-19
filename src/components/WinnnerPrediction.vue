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

const getColor = (team: Team) => {
  return `rgb(${team.color.r} ${team.color.g} ${team.color.b})`
}
</script>

<template>
  <div class="prediction-winner">
    <label
      for="prediction-winner-team-1"
      class="prediction-winner__team"
      :style="{ color: getColor(game.team1) }"
    >
      <input
        type="radio"
        id="prediction-winner-team-1"
        name="prediction-winner"
        v-model="selected"
        :value="game.team1.id"
      />
      <span class="prediction-winner__team-name">{{ game.team1.alias }}</span>
    </label>
    <span class="prediction-winner__vs">VS</span>
    <label
      for="prediction-winner-team-2"
      class="prediction-winner__team"
      :style="{ color: getColor(game.team2) }"
    >
      <input
        type="radio"
        id="prediction-winner-team-2"
        name="prediction-winner"
        v-model="selected"
        :value="game.team2.id"
      />
      <span class="prediction-winner__team-name">{{ game.team2.alias }}</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.prediction-winner {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;

  &__team {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    aspect-ratio: 1/1;
    width: 80px;
    border-radius: 50%;
    cursor: pointer;
    color: #fff;
    font-weight: bold;
    // border: 4px dashed currentColor;
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.3);

    input {
      display: none;
    }

    &:has(input:checked) {
      background-color: currentColor;

      .prediction-winner__team-name {
        color: #fff;
      }
    }
  }

  &__team-name {
    font-weight: bold;
  }
}
</style>
