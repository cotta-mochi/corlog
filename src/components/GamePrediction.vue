<script setup lang="ts">
import type {
  Game,
  Player,
  GamePrediction,
  WinnerPrediction,
  ScoreLeaderPrediction,
  WhoScores29Prediction,
} from '@/types'
import GameSummary from '@/components/GameSummary.vue'
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import WinnerPredictionComp from '@/components/WinnnerPrediction.vue'
import ScoreLeaderPredictionComp from '@/components/ScoreLeaderPrediction.vue'
import WhoScores29PredictionComp from '@/components/WhoScores29Prediction.vue'

const { game } = defineProps<{
  game: Game
}>()

const players = ref<Player[]>([])
const prediction = ref<GamePrediction | undefined>(undefined)
const selectedScoreLeader = ref<Player | undefined>(undefined)
const selectedWhoGets29 = ref<Player | undefined>(undefined)
const winnerPrediction = ref<WinnerPrediction>({
  gameId: game.id,
  winnerTeamId: undefined,
})
const scoreLeaderPrediction = ref<ScoreLeaderPrediction>({
  gameId: game.id,
  scoreLeader: undefined,
})
const whoScores29Prediction = ref<WhoScores29Prediction>({
  gameId: game.id,
  whoScores29: undefined,
})

const updateWinnerPrediction = async () => {
  console.log('updateWinnerPrediction', winnerPrediction.value)
  if (!winnerPrediction.value) {
    return
  }
  await api.updateMyWinnerPrediction(game.id, winnerPrediction.value?.winnerTeamId)
}

const updateScoreLeader = async () => {
  if (!scoreLeaderPrediction.value) return
  await api.updateMyScoreLeaderPrediction(game.id, scoreLeaderPrediction.value.scoreLeader)
}

const updateWhoGets29 = async () => {
  if (!whoScores29Prediction.value) {
    return
  }
  await api.updateMyWhoScores29Prediction(game.id, whoScores29Prediction.value.whoScores29)
}

onMounted(async () => {
  winnerPrediction.value = await api.fetchMyWinnerPrediction(game.id)
  scoreLeaderPrediction.value = await api.fetchMyScoreLeaderPrediction(game.id)
  whoScores29Prediction.value = await api.fetchMyWhoScores29Prediction(game.id)
  players.value = await api.fetchPlayers(game.team1.id)
  selectedScoreLeader.value = players.value.find(
    (player) => player.id === prediction.value?.scoreLeader,
  )
  selectedWhoGets29.value = players.value.find(
    (player) => player.id === prediction.value?.whoGets29,
  )
})
</script>

<template>
  <div class="game-prediction">
    <GameSummary :game="game" v-if="game" :show-timer="true" />
    <div class="game-prediction__inner inline-padding">
      <h2 class="game-prediction__prediction-item-title">次戦の予想</h2>
      <div class="game-prediction__prediction-item">
        <h3 class="game-prediction__prediction-item-title">勝つのはどっち？</h3>
        <WinnerPredictionComp
          v-if="winnerPrediction"
          :game="game"
          v-model="winnerPrediction.winnerTeamId"
          @update:model-value="updateWinnerPrediction"
        />
      </div>
      <div class="game-prediction__prediction-item">
        <h3 class="game-prediction__prediction-item-title">スコアリーダーは誰？</h3>
        <ScoreLeaderPredictionComp
          v-if="scoreLeaderPrediction"
          :game="game"
          :players="players"
          v-model="scoreLeaderPrediction.scoreLeader"
          @update:model-value="updateScoreLeader"
        />
      </div>
      <div class="game-prediction__prediction-item">
        <h3 class="game-prediction__prediction-item-title">29点は誰が取る？</h3>
        <WhoScores29PredictionComp
          v-if="whoScores29Prediction"
          :game="game"
          :players="players"
          v-model="whoScores29Prediction.whoScores29"
          @update:model-value="updateWhoGets29"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
