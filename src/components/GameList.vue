<script setup lang="ts">
import { type Game } from '@/types'
import GameCard from '@/components/GameCard.vue'
const { games } = defineProps<{
  games: Game[]
}>()
</script>

<template>
  <ul class="game-list">
    <li v-for="game in games" :key="game.id">
      <router-link :to="`/game/${game.id}`">
        <GameCard :game="game" />
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.game-list {
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    border-bottom: 1px solid #ccc;
  }
}
</style>
