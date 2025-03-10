<script setup lang="ts">
import type { Game } from '@/types'
import { format } from 'date-fns'

defineProps<{
  game: Game
}>()
</script>

<template>
  <div class="game-card">
    <div class="game-card__header">
      <div class="game-card__date">{{ format(game.date, 'yyyy-MM-dd') }}</div>
      <div class="game-card__location">{{ game.location }}</div>
    </div>
    <div class="game-card__body">
      <div class="game-card__team">
        <div class="game-card__team-name">{{ game.team1.name }}</div>
      </div>
      <div class="game-card__team">
        <div class="game-card__team-name">{{ game.team2.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  padding: 1rem;
}
</style>
