<script setup lang="ts">
import GameList from '../components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { onMounted } from 'vue'

const gameStore = useGameStore()

onMounted(async () => {
  await gameStore.fetchGames()
})
</script>

<template>
  <main>
    <GameList :games="gameStore.games" />
  </main>
</template>
