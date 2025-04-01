<script lang="ts" setup>
import { computed } from 'vue'
import { lastDayOfMonth, eachWeekOfInterval, addDays, format } from 'date-fns'
import type { Game } from '@/types'
import TeamLabel from './TeamLabel.vue'

const {
  year,
  month,
  weekdays = ['日', '月', '火', '水', '木', '金', '土'],
  games,
} = defineProps<{
  year: number
  month: number
  weekdays?: Array<string>
  games: Array<Game>
}>()

const dates = computed(() => {
  const start = new Date(year, month, 1)
  const weeks = eachWeekOfInterval({
    start,
    end: lastDayOfMonth(start),
  })
  const dates: Date[] = []
  weeks.forEach((weekStart) => {
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStart, i))
    }
  })
  return dates
})

const getGameByDate = (targetDate: Date): Game | undefined => {
  return games.find((game) => format(game.date, 'yyyyMMdd') === format(targetDate, 'yyyyMMdd'))
}

const getTotalScore = (game: Game) => {
  return game.scores?.reduce(
    (acc, cur) => {
      return {
        team1: acc.team1 + cur.team1,
        team2: acc.team2 + cur.team2,
      }
    },
    { team1: 0, team2: 0 },
  )
}
</script>

<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__cell text-center" v-for="weekday in weekdays" :key="weekday">
        <p>{{ weekday }}</p>
      </div>
    </div>
    <div class="calendar__body">
      <div class="calendar__cell" v-for="date in dates" :key="date.toISOString()">
        <p class="calendar__day text-center">{{ date.getDate() }}</p>
        <div v-for="game in [getGameByDate(date)]" :key="game?.id" class="calendar-game">
          <router-link v-if="game !== undefined" :to="`/game/${game.id}`">
            <TeamLabel :team="game.team2" font-size="0.6rem"></TeamLabel>
            <p v-if="game.status !== 'finished'" class="calendar-game__start-time">
              {{ format(game.date, 'HH:mm') }}
            </p>
            <p v-if="game.status === 'finished'" class="calendar-game__score">
              <span class="text-bold">{{ getTotalScore(game)?.team1 }}</span
              >-<span class="text-bold">{{ getTotalScore(game)?.team2 }}</span>
            </p>
            <p v-if="game.status === 'finished'" class="calendar-game__result">
              <span
                class="calendar-game__result-mark"
                :class="{
                  'is-lose': (getTotalScore(game)?.team1 ?? 0) < (getTotalScore(game)?.team2 ?? 0),
                }"
              ></span>
            </p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  font-size: 0.8rem;

  &__header,
  &__body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  &__cell {
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;

    &:nth-child(7n) {
      border-right: 0;
    }
  }

  &__header &__cell {
    line-height: 1.2;
  }

  &__body &__cell {
    min-height: 85px;
  }

  &-game > a {
    text-align: center;
    display: block;
    padding: 4px 0;
  }

  &-game__score {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    font-size: 0.8rem;
    letter-spacing: 0;
  }

  &-game__result {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-game__result-mark {
    display: block;
    width: 16px;
    aspect-ratio: 1;
    border: 1px solid #aaa;
    border-radius: 50%;
    background: #fff;
  }

  &-game__result-mark.is-lose {
    background: #000;
    border: 0;
  }
}
</style>
