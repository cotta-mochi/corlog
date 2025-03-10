<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import type { GameSatisfaction, Game } from '@/types'
import { ref, onMounted, watch } from 'vue'

const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()

const satisfaction = ref<number | undefined>(undefined)

onMounted(async () => {
  const gameSatisfaction = (await gameStore.fetchGameSatisfactions(gameId)) as GameSatisfaction
  satisfaction.value = gameSatisfaction.satisfaction
})

const updateSatisfaction = (value: number) => {
  satisfaction.value = value
  gameStore.updateGameSatisfaction(gameId, value)
}
</script>
<template>
  <div class="game-satisfaction inline-padding">
    <h2 class="game-satisfaction__title">この試合の満足度：</h2>
    <v-rating
      hover
      :length="5"
      size="small"
      :model-value="satisfaction"
      color="#aaa"
      active-color="secondary"
      empty-icon="mdi-basketball"
      half-icon="mdi-basketball"
      full-icon="mdi-basketball"
      density="compact"
      :clearable="true"
      @update:model-value="updateSatisfaction"
    ></v-rating>
  </div>
</template>

<style scoped lang="scss">
.game-satisfaction {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__title {
    font-size: 0.85rem;
    font-weight: 400;
  }
}
</style>
