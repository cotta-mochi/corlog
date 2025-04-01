<script lang="ts" setup>
import { useGameStore } from '@/stores/gameStore'
import GameList from '@/components/GameList.vue'
import { computed, ref } from 'vue'
import type { Game } from '@/types'
import GameCalendar from '@/components/GameCalendar.vue'
import { useGameListViewStore } from '@/stores/gameListViewStore'

type ViewModeType = 'list' | 'calendar'

const gameStore = useGameStore()
const games = ref<Game[]>([])
;(async () => {
  await gameStore.fetchGames()
  games.value = gameStore.games
})()

const viewStore = useGameListViewStore()

const filteredGames = computed(() => {
  return games.value.filter((game) => {
    return game.date.getFullYear() === viewStore.year && game.date.getMonth() === viewStore.month
  })
})

const prevMonth = () => {
  if (viewStore.month === 0) {
    viewStore.updateYear(viewStore.year - 1)
    viewStore.updateMonth(11)
  } else {
    viewStore.updateMonth(viewStore.month - 1)
  }
}

const nextMonth = () => {
  if (viewStore.month === 11) {
    viewStore.updateYear(viewStore.year + 1)
    viewStore.updateMonth(0)
  } else {
    viewStore.updateMonth(viewStore.month + 1)
  }
}

const switchViewMode = (newMode: ViewModeType) => {
  viewStore.updateViewMode(newMode)
}
</script>
<template>
  <div class="games">
    <div class="games__header">
      <div class="games__header__left"></div>
      <div class="games__year-month">
        <p class="games__year-month__value">
          <span class="font-roboto games__year-month__num">{{ viewStore.year }}</span
          >年<span class="font-roboto games__year-month__num">{{ viewStore.month + 1 }}</span
          >月
        </p>
        <v-btn
          icon="mdi-chevron-left"
          size="xsmall"
          variant="text"
          class="games__year-month__prev"
          @click="prevMonth"
        ></v-btn>
        <v-btn
          icon="mdi-chevron-right"
          size="xsmall"
          variant="text"
          class="games__year-month__next"
          @click="nextMonth"
        ></v-btn>
      </div>
      <div class="games__header__right text-center">
        <v-btn
          v-show="viewStore.viewMode !== 'calendar'"
          icon="mdi-calendar"
          variant="text"
          color="accent"
          @click="switchViewMode('calendar')"
        ></v-btn>
        <v-btn
          v-show="viewStore.viewMode !== 'list'"
          icon="mdi-view-list"
          variant="text"
          color="accent"
          @click="switchViewMode('list')"
        ></v-btn>
      </div>
    </div>
    <template v-if="viewStore.viewMode === 'list'">
      <GameList :games="filteredGames" v-show="filteredGames.length > 0"></GameList>
      <div class="games__no-data inline-padding" v-show="filteredGames.length === 0">
        <p class="text-center">試合がありません。</p>
      </div>
    </template>
    <template v-if="viewStore.viewMode === 'calendar'">
      <GameCalendar
        :year="viewStore.year"
        :month="viewStore.month"
        :games="filteredGames"
      ></GameCalendar>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.games {
  &__header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
    background: rgb(var(--color-primary-rgb) / 0.1);
  }
  &__year-month {
    display: flex;
    align-items: center;
    gap: 16px;
    letter-spacing: 0.02em;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;

    &__num {
      font-size: 1.5rem;
      padding: 0 4px;
    }

    &__prev {
      order: -1;
    }
  }

  &__no-data {
    padding: 1rem 0;
  }
}
</style>
