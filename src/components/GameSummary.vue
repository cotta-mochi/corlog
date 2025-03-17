<script setup lang="ts">
import type { Game } from '@/types'
import { format } from 'date-fns'
import { computed } from 'vue'
import { PhCaretDown, PhCaretUp, PhScroll, PhTable } from '@phosphor-icons/vue'
import TeamLabel from './TeamLabel.vue'
import CountdownTimer from './CountdownTimer.vue'
const {
  game,
  isToggleable = false,
  isExpanded = true,
  showTimer = false,
} = defineProps<{
  game: Game
  isToggleable?: boolean
  isExpanded?: boolean
  showTimer?: boolean
}>()

const emit = defineEmits<{
  'update:is-expanded': [boolean]
}>()

const quaterScores = computed(() => {
  if (game.scores === undefined) {
    return []
  }
  return game.scores.slice(0, 4).map((score) => {
    return {
      ...score,
    }
  })
})

const bgColor = computed(() => {
  const team1Color = `rgb(${game.team1.color.r}, ${game.team1.color.g}, ${game.team1.color.b})`
  const team2Color = `rgb(${game.team2.color.r}, ${game.team2.color.g}, ${game.team2.color.b})`
  return `linear-gradient(45deg, ${team1Color} 0%, ${team1Color} 50%, ${team2Color} 50%, ${team2Color} 100%)`
})

const weekdayText = computed(() => {
  return ['日', '月', '火', '水', '木', '金', '土'][new Date(game.date).getDay()]
})

const tipoffTimeText = computed(() => {
  return format(game.date, 'HH:mm')
})

const isUpcoming = computed(() => {
  return game.status === 'upcoming'
})

const isTimerVisible = computed(() => {
  return showTimer && isUpcoming.value && !isToggleable
})
</script>

<template>
  <div
    class="game-summary inline-padding"
    :style="{ background: bgColor }"
    :class="{
      'game-summary--expanded': isExpanded,
      'game-summary--toggleable': isToggleable,
      'game-summary--upcoming': isUpcoming,
    }"
  >
    <button
      class="game-summary__toggle-button"
      @click="emit('update:is-expanded', !isExpanded)"
      v-if="isToggleable"
    >
      <PhCaretDown size="18" weight="bold" v-show="isExpanded" />
      <PhCaretUp size="18" weight="bold" v-show="!isExpanded" />
    </button>
    <p class="game-summary__timer" v-if="isTimerVisible">
      <CountdownTimer :date="game.date" />
    </p>
    <div class="game-summary__inner inline-padding">
      <p class="game-summary__date">
        {{ format(game.date, 'yyyy.MM.dd') }}
        <span class="game-summary__weekday">({{ weekdayText }})</span>
      </p>
      <p class="game-summary__tipoff-time" v-show="isExpanded">{{ tipoffTimeText }} TIPOFF</p>
      <p class="game-summary__location" v-show="isExpanded">{{ game.location }}</p>
      <div class="game-summary__teams-and-scores">
        <div class="game-summary__team game-summary__team--left">
          <TeamLabel :team="game.team1" />
          <p class="game-summary__team-score" v-if="!isUpcoming">
            {{ game.scores?.reduce((acc, score) => acc + score.team1, 0) }}
          </p>
        </div>
        <div class="game-summary__quaters" v-show="isExpanded">
          <div
            class="game-summary__quater font-roboto"
            v-for="(quaterScore, idx) in quaterScores"
            :key="`score-${idx}q`"
          >
            <p class="game-summary__quater-score">{{ quaterScore.team1 }}</p>
            <p class="game-summary__quater-name">{{ idx + 1 }}Q</p>
            <p class="game-summary__quater-score">{{ quaterScore.team2 }}</p>
          </div>
        </div>
        <div class="game-summary__team-score-separator" v-show="!isExpanded"></div>
        <div class="game-summary__team game-summary__team--right">
          <TeamLabel :team="game.team2" />
          <p class="game-summary__team-score" v-if="!isUpcoming">
            {{ game.scores?.reduce((acc, score) => acc + score.team2, 0) }}
          </p>
        </div>
      </div>
      <div class="game-summary__links" v-show="isExpanded">
        <v-btn
          :href="`https://www.bleague.jp/game_detail/?ScheduleKey=${game.scheduleKey}&tab=2`"
          target="_blank"
          rel="noopener noreferrer"
          variant="flat"
          size="small"
          color="primary"
          class="game-summary__link button button--primary"
          v-if="!isUpcoming"
        >
          <template v-slot:prepend>
            <PhScroll size="18" weight="bold" />
          </template>
          <span class="text-bold">試合レポート</span>
        </v-btn>

        <v-btn
          :href="`https://www.bleague.jp/game_detail/?ScheduleKey=${game.scheduleKey}&tab=4`"
          target="_blank"
          rel="noopener noreferrer"
          variant="flat"
          size="small"
          color="primary"
          class="game-summary__link button button--primary"
          v-if="!isUpcoming"
        >
          <template v-slot:prepend>
            <PhTable size="18" weight="bold" />
          </template>
          <span class="text-bold">ボックススコア</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-summary {
  padding-block: 8px;
  text-align: center;

  &--expanded.game-summary--toggleable {
    padding-top: 4px;
  }

  &__toggle-button {
    display: flex;
    justify-content: center;
    color: #fff;
    width: 100%;
  }

  &__timer {
    margin-bottom: 8px;
  }

  &__inner {
    background-color: rgb(255 255 255 /0.7);
    padding-block: 8px;
  }

  &__date {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: left;
    line-height: 1.2;
  }

  &__weekday {
    font-size: 0.8rem;
    font-weight: bold;
    line-height: 1.2;
  }

  &__tipoff-time {
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.2;
  }

  &__location {
    font-size: 11px;
    line-height: 1.2;
  }

  &__teams-and-scores {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
  }

  &__team {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-inline: auto;
  }

  &__team-name {
    font-size: 0.9rem;
    flex: 1 1 auto;
  }

  &__team-score {
    width: 60px;
    font-size: 1.5rem;
    font-weight: bold;
    flex-grow: 1;
  }
  &__team--right &__team-score {
    order: -1;
  }

  &__team-score-separator {
    width: 1rem;
    height: 4px;
    background-color: currentColor;
  }

  &__quaters {
    display: grid;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__quater {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
    line-height: 1.1;
  }

  &__quater-score {
    flex: 1 1 auto;
  }

  &__quater-name {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-secondary);
    color: #fff;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: bold;
    flex: 0 0 auto;
    padding: 0.1em 10px;
    line-height: 1;
    letter-spacing: 0.06em;
  }

  &__links {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  &--expanded &__date {
    font-size: 1.2rem;
    text-align: center;
  }

  &--expanded &__teams-and-scores {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: #fff;
    margin-block: 8px;
    padding: 8px;
  }

  &--expanded &__team {
    display: grid;
    grid-template-rows: auto 1fr;
    justify-content: center;
  }

  &--expanded &__team--right &__team-score {
    order: 0;
  }

  &--upcoming &__team {
    grid-template-rows: 1fr;
    grid-template-columns: minmax(60px, auto);
  }
}
</style>
