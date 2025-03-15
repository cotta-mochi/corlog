<script setup lang="ts">
import GameList from '@/components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { onMounted } from 'vue'
const gameStore = useGameStore()
onMounted(() => {
  gameStore.fetchGames()
})
</script>
<template>
  <GameList :games="gameStore.games" :is-admin="true" />
</template>
