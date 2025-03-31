<script setup lang="ts">
import type { Game, Score } from '@/types'
import { format } from 'date-fns'
import TeamLabel from './TeamLabel.vue'
import GoogleMapLink from '@/components/GoogleMapLink.vue'
import { computed } from 'vue'
const { game } = defineProps<{
  game: Game
  to?: string
}>()

const team1Score = computed(() => {
  return game.scores?.reduce((acc: number, score: Score) => acc + score.team1, 0)
})
const team2Score = computed(() => {
  return game.scores?.reduce((acc: number, score: Score) => acc + score.team2, 0)
})
</script>

<template>
  <div class="game-card">
    <div class="game-card__left">
      <div class="game-card__date font-roboto">
        <p class="game-card__year">{{ format(game.date, 'yyyy') }}</p>
        <p class="game-card__month-and-day font-roboto text-bold">
          <span class="game-card__month">{{ format(game.date, 'MM') }}</span>
          <span class="game-card__day">{{ format(game.date, 'dd') }}</span>
        </p>
      </div>
    </div>
    <div class="game-card__body">
      <component :is="to === undefined ? 'div' : 'router-link'" :to="`/game/${game.id}`">
        <div class="game-card__team-and-score">
          <TeamLabel :team="game.team1" />
          <p class="game-card__scores">
            <span
              class="font-roboto text-bold"
              :class="{ 'text-secondary': (team1Score ?? 0) > (team2Score ?? 0) }"
              >{{ team1Score }}</span
            >
            <span class="game-card__score-separator">-</span>
            <span
              class="font-roboto text-bold"
              :class="{ 'text-secondary': (team1Score ?? 0) < (team2Score ?? 0) }"
              >{{ team2Score }}</span
            >
          </p>
          <TeamLabel :team="game.team2" />
        </div>
      </component>
      <p class="game-card__location">
        <GoogleMapLink :location="game.location" v-if="game.location" />
      </p>
      <p class="game-card__tip-off-time">
        {{ format(game.date, 'HH:mm') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-card {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 1rem 4px;

  &__year {
    text-align: center;
    letter-spacing: 0.1em;
    color: var(--color-accent);
    font-size: 0.9rem;
  }

  &__month-and-day {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    aspect-ratio: 1;
    width: 100%;
    letter-spacing: -0.1em;
    line-height: 1;
    color: rgb(var(--color-accent-rgb) / 1);

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      background-color: rgb(var(--color-accent-rgb) / 0.5);
      height: 1px;
      transform: rotate(-45deg);
    }
  }

  &__month {
    font-size: 1.3rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__day {
    font-size: 1.3rem;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  &__tip-off-time {
    font-size: 0.85rem;
    color: #666;
    text-align: center;
    line-height: 1.1;
  }

  &__body {
  }

  &__team-and-score {
    display: grid;
    grid-template-columns: 1fr 50% 1fr;
    align-items: center;
    padding-inline: 0.5rem;
  }

  &__scores {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.7rem;
  }

  &__location {
    font-size: 0.75rem;
    color: #666;
    text-align: center;
    line-height: 1.1;
  }

  &__score {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 1.2rem;
  }
}
</style>
