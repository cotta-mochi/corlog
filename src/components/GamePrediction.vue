<script setup lang="ts">
import type {
  Game,
  Player,
  WinnerPrediction,
  ScoreLeaderPrediction,
  WhoScores29Prediction,
} from '@/types'
import GameSummary from '@/components/GameSummary.vue'
import { ref, onMounted } from 'vue'
import { gamePredictionService } from '@/services/gamePredictionService'
import { useTeamStore } from '@/stores/teamStore'
import WinnerPredictionComp from '@/components/WinnnerPrediction.vue'
import ScoreLeaderPredictionComp from '@/components/ScoreLeaderPrediction.vue'
import WhoScores29PredictionComp from '@/components/WhoScores29Prediction.vue'

const { game } = defineProps<{
  game: Game
}>()

const page = ref(0)
const players = ref<Player[]>([])
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
  await gamePredictionService.updateMyWinnerPrediction(
    game.id,
    winnerPrediction.value?.winnerTeamId,
  )
}

const updateScoreLeader = async () => {
  if (!scoreLeaderPrediction.value) return
  await gamePredictionService.updateMyScoreLeaderPrediction(
    game.id,
    scoreLeaderPrediction.value.scoreLeader,
  )
}

const updateWhoGets29 = async () => {
  if (!whoScores29Prediction.value) {
    return
  }
  await gamePredictionService.updateMyWhoScores29Prediction(
    game.id,
    whoScores29Prediction.value.whoScores29,
  )
}

onMounted(async () => {
  winnerPrediction.value = await gamePredictionService.fetchMyWinnerPrediction(game.id)
  scoreLeaderPrediction.value = await gamePredictionService.fetchMyScoreLeaderPrediction(game.id)
  whoScores29Prediction.value = await gamePredictionService.fetchMyWhoScores29Prediction(game.id)
  players.value = await useTeamStore().fetchPlayers(game.team1.id)
})
</script>

<template>
  <div class="game-prediction">
    <div class="game-prediction__inner">
      <v-carousel height="140" :hide-delimiters="true" v-model="page">
        <template v-slot:prev="{ props }">
          <v-btn
            class="game-prediction__carousel-arrow game-prediction__carousel-arrow--prev"
            color="primary"
            variant="text"
            @click="props.onClick"
            icon="mdi-chevron-left"
          />
        </template>
        <template v-slot:next="{ props }">
          <v-btn
            class="game-prediction__carousel-arrow game-prediction__carousel-arrow--next"
            color="primary"
            variant="text"
            @click="props.onClick"
            icon="mdi-chevron-right"
          />
        </template>
        <v-carousel-item>
          <div class="game-prediction__prediction-item">
            <h3 class="game-prediction__prediction-item-title">勝つのはどっち？</h3>
            <WinnerPredictionComp
              v-if="winnerPrediction"
              :game="game"
              v-model="winnerPrediction.winnerTeamId"
              @update:model-value="updateWinnerPrediction"
            />
          </div>
        </v-carousel-item>
        <v-carousel-item>
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
        </v-carousel-item>
        <v-carousel-item>
          <div class="game-prediction__prediction-item">
            <h3 class="game-prediction__prediction-item-title">29点目を取るのは誰？</h3>
            <WhoScores29PredictionComp
              v-if="whoScores29Prediction"
              :game="game"
              :players="players"
              v-model="whoScores29Prediction.whoScores29"
              @update:model-value="updateWhoGets29"
            />
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-prediction__inner {
  background: #fff;
}
.game-prediction__title {
  margin-bottom: 16px;
}

.game-prediction__carousel-arrow {
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);

  &--prev {
    left: 0;
  }

  &--next {
    right: 0;
  }
}

.game-prediction__prediction-item {
  display: grid;
  grid-template-rows: auto 1fr;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgb(var(--color-primary-rgb) / 0.05);
  padding: 8px;

  &-title {
    margin-bottom: 8px;
    text-align: center;
    padding-inline: 20px;
    font-size: 1.1rem;
    opacity: 0.7;
    transform: skewX(-15deg);
  }
}
</style>
