<script setup lang="ts">
import { type Game } from '@/types'
import GameCard from '@/components/GameCard.vue'
const { games, isAdmin = false } = defineProps<{
  games: Game[]
  isAdmin?: boolean
}>()
</script>

<template>
  <ul class="game-list">
    <li v-for="game in games" :key="game.id">
      <router-link :to="isAdmin ? `/admin/game/${game.id}` : `/game/${game.id}`">
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
