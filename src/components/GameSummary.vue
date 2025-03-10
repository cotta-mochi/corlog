<script setup lang="ts">
import type { Game } from '@/types'
import { format } from 'date-fns'
import { computed } from 'vue'
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'

const {
  game,
  isToggleable = false,
  isExpanded = true,
} = defineProps<{
  game: Game
  isToggleable?: boolean
  isExpanded?: boolean
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
</script>

<template>
  <div
    class="game-summary inline-padding"
    :style="{ background: bgColor }"
    :class="{
      'game-summary--expanded': isExpanded,
      'game-summary--toggleable': isToggleable,
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
    <div class="game-summary__inner inline-padding">
      <p class="game-summary__date">
        {{ format(game.date, 'yyyy.MM.dd') }}
        <span class="game-summary__weekday">({{ weekdayText }})</span>
      </p>
      <p class="game-summary__tipoff-time" v-show="isExpanded">{{ tipoffTimeText }} TIPOFF</p>
      <p class="game-summary__location" v-show="isExpanded">{{ game.location }}</p>
      <div class="game-summary__teams-and-scores">
        <div class="game-summary__team game-summary__team--left">
          <img :src="game.team1.logo" alt="team1" v-if="game.team1.logo" />
          <p class="game-summary__team-name">{{ game.team1.alias }}</p>
          <p class="game-summary__team-score">
            {{ game.scores?.reduce((acc, score) => acc + score.team1, 0) }}
          </p>
        </div>
        <div class="game-summary__quaters" v-show="isExpanded">
          <div
            class="game-summary__quater"
            v-for="(quaterScore, idx) in quaterScores"
            :key="`score-${idx}q`"
          >
            <p class="game-summary__quater-score">{{ quaterScore.team1 }}</p>
            <p class="game-summary__quater-name">{{ idx + 1 }}Q</p>
            <p class="game-summary__quater-score">{{ quaterScore.team2 }}</p>
          </div>
        </div>
        <div class="game-summary__team game-summary__team--right">
          <img :src="game.team2.logo" alt="team2" v-if="game.team2.logo" />
          <p class="game-summary__team-name">{{ game.team2.alias }}</p>
          <p class="game-summary__team-score">
            {{ game.scores?.reduce((acc, score) => acc + score.team2, 0) }}
          </p>
        </div>
      </div>
      <div class="game-summary__links" v-show="isExpanded">
        <a
          :href="`https://www.bleague.jp/game_detail/?ScheduleKey=${game.scheduleKey}&tab=2`"
          class="game-sumamry__link button button--primary"
          target="_blank"
          >試合レポート</a
        >
        <a
          :href="`https://www.bleague.jp/game_detail/?ScheduleKey=${game.scheduleKey}&tab=4`"
          class="game-sumamry__link button button--primary"
          target="_blank"
          >ボックススコア</a
        >
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
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
  }

  &__team {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__team-name {
    flex: 1 1 auto;
  }

  &__team-score {
    width: 60px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  &__team--right &__team-score {
    order: -1;
  }

  &__quaters {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__quater {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    line-height: 1.1;
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
    background: #fff;
    margin-block: 8px;
    padding: 8px;
  }
}
</style>
