<script lang="ts" setup>
import type { Game, Player, Team } from '@/types'
import TeamLabel from '@/components/TeamLabel.vue'
import PlayerComponent from '@/components/Player.vue'
import { gamePredictionService } from '@/services/gamePredictionService'
import { gameService } from '@/services/gameService'
import { onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
const { game, players } = defineProps<{
  game: Game
  players: Player[]
}>()
const teamStore = useTeamStore()
const winner = ref<{
  prediction: Team | undefined
  result: Team | undefined
}>({
  prediction: undefined,
  result: undefined,
})

const scoreLeader = ref<{
  prediction: Player | undefined
  result: Player[] | undefined
}>({
  prediction: undefined,
  result: undefined,
})

const whoScores29 = ref<{
  prediction: Player | undefined
  result: Player | undefined
}>({
  prediction: undefined,
  result: undefined,
})

const isCorrect = (
  item: typeof winner.value | typeof scoreLeader.value | typeof whoScores29.value,
): boolean => {
  if (!item.prediction || !item.result) {
    return false
  }
  return Array.isArray(item.result)
    ? item.result?.find((player) => player.id === item.prediction?.id) !== undefined
    : item.result.id === item.prediction.id
}

const isWrong = (
  item: typeof winner.value | typeof scoreLeader.value | typeof whoScores29.value,
): boolean => {
  if (!item.prediction || !item.result) {
    return false
  }
  return !isCorrect(item)
}

onMounted(async () => {
  const winnerPredictionTeamId = (await gamePredictionService.fetchMyWinnerPrediction(game.id))
    ?.winnerTeamId
  winner.value.prediction = winnerPredictionTeamId
    ? await teamStore.fetchTeam(winnerPredictionTeamId)
    : undefined
  winner.value.result = await gameService.getWinnerTeam(game)

  const scoreLeaderPredictionPlayerId = (
    await gamePredictionService.fetchMyScoreLeaderPrediction(game.id)
  ).scoreLeader
  scoreLeader.value.prediction = scoreLeaderPredictionPlayerId
    ? players.find((player) => player.id === scoreLeaderPredictionPlayerId)
    : undefined
  scoreLeader.value.result = (await gameService.fetchScoreLeaders(game.id)).scoreLeaders
    ?.map((id) => players.find((player) => player.id === id))
    ?.filter((player) => player !== undefined)

  const whoScores29PredictionPlayerId = (
    await gamePredictionService.fetchMyWhoScores29Prediction(game.id)
  )?.whoScores29
  whoScores29.value.prediction = whoScores29PredictionPlayerId
    ? players.find((player) => player.id === whoScores29PredictionPlayerId)
    : undefined

  const whoScores29ResultPlayerId = (await gameService.fetchWhoScores29(game.id))?.whoScores29
  whoScores29.value.result = whoScores29ResultPlayerId
    ? players.find((player) => player.id === whoScores29ResultPlayerId)
    : undefined
})
</script>
<template>
  <div class="game-prediction-result inline-padding" v-if="game && players.length > 0">
    <div class="game-prediction-result__item game-prediction-result__header">
      <p class="game-prediction-result__prediction">予想</p>
      <p class="game-prediction-result__result">結果</p>
    </div>
    <div class="game-prediction-result__item">
      <h3 class="game-prediction-result__title">勝利チーム</h3>
      <p
        class="game-prediction-result__sign"
        :class="{
          'is-correct': isCorrect(winner),
          'is-wrong': isWrong(winner),
        }"
      ></p>
      <p class="game-prediction-result__prediction">
        <TeamLabel :team="winner.prediction" v-if="winner.prediction" />
        <span v-else>No Data</span>
      </p>
      <p class="game-prediction-result__result">
        <TeamLabel :team="winner.result" v-if="winner.result" />
        <span v-else>No Data</span>
      </p>
    </div>
    <div class="game-prediction-result__item">
      <h3 class="game-prediction-result__title">スコアリーダー</h3>
      <p
        class="game-prediction-result__sign"
        :class="{
          'is-correct': isCorrect(scoreLeader),
          'is-wrong': isWrong(scoreLeader),
        }"
      ></p>
      <div class="game-prediction-result__prediction">
        <div class="game-prediction-result__player-wrapper" v-if="scoreLeader.prediction">
          <PlayerComponent
            :team="game.team1"
            :player="scoreLeader.prediction"
            :is-small="true"
          ></PlayerComponent>
        </div>
        <div v-else>No Data</div>
      </div>
      <div class="game-prediction-result__result">
        <div class="game-prediction-result__player-wrapper" v-if="scoreLeader.result">
          <PlayerComponent
            v-for="player in scoreLeader.result"
            :key="player.id"
            :team="game.team1"
            :player="player"
            :is-small="true"
          ></PlayerComponent>
        </div>
        <div v-else>No Data</div>
      </div>
    </div>
    <div class="game-prediction-result__item">
      <h3 class="game-prediction-result__title">29点目</h3>
      <p
        class="game-prediction-result__sign"
        :class="{
          'is-correct': isCorrect(whoScores29),
          'is-wrong': isWrong(whoScores29),
        }"
      ></p>
      <div class="game-prediction-result__prediction">
        <div class="game-prediction-result__player-wrapper" v-if="whoScores29.prediction">
          <PlayerComponent
            :team="game.team1"
            :player="whoScores29.prediction"
            :is-small="true"
          ></PlayerComponent>
        </div>
        <div v-else>No Data</div>
      </div>
      <div class="game-prediction-result__result">
        <div class="game-prediction-result__player-wrapper" v-if="whoScores29.result">
          <PlayerComponent
            :team="game.team1"
            :player="whoScores29.result"
            :is-small="true"
          ></PlayerComponent>
        </div>
        <div v-else>No Data</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-prediction-result {
  margin-block: 0.5rem;
  text-align: center;

  &__item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 150px 1fr;
    align-items: center;
    gap: 8px;
    border-top: 1px solid #ccc;
    padding-block: 0.5rem;
  }

  &__header {
    font-size: 0.8rem;
    text-align: center;
    line-height: 1.1;
    border: 0;
    letter-spacing: 0.2em;
    font-weight: bold;
    background-color: #eee;
  }
  &__title {
    position: relative;
    z-index: 1;
    grid-area: 1/2/2/3;
    text-align: center;
    font-size: 0.9rem;
    text-shadow:
      1px 1px 0 rgb(255, 255, 255 / 0.5),
      -1px 1px 0 rgb(255, 255, 255 / 0.5),
      -1px -1px 0 rgb(255, 255, 255 / 0.5),
      1px -1px 0 rgb(255, 255, 255 / 0.5);
  }

  &__prediction {
    grid-area: 1/1/2/2;
    opacity: 0.5;
  }

  &__result {
    grid-area: 1/3/2/4;
  }

  &__sign {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    background-color: transparent;
    z-index: 0;

    &.is-correct::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid rgb(var(--color-secondary-rgb) / 1);
    }

    &.is-wrong::before,
    &.is-wrong::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      content: '';
      display: block;
      border: 0;
      width: 100%;
      height: 4px;
      background-color: rgb(var(--color-primary-rgb) / 0.5);
      z-index: 1;
    }

    &.is-wrong::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  &__player-wrapper {
    max-width: 50px;
    margin-inline: auto;
  }
}
</style>
