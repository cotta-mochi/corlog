<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import type { GameSatisfaction, Game } from '@/types'
import { ref, onMounted } from 'vue'

const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()

const satisfaction = ref<number | undefined>(undefined)

onMounted(async () => {
  const gameSatisfaction = (await gameStore.fetchGameSatisfaction(gameId)) as GameSatisfaction
  satisfaction.value = gameSatisfaction.satisfaction
})

const updateSatisfaction = (value: string | number) => {
  satisfaction.value = Number(value)
  gameStore.updateGameSatisfaction(gameId, Number(value))
}
</script>
<template>
  <div class="game-satisfaction inline-padding">
    <v-rating
      hover
      :length="5"
      size="x-large"
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
  flex-direction: column;
  align-items: center;
}
</style>
