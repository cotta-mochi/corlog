<script setup lang="ts">
import GameSummary from '@/components/GameSummary.vue'
import WhoScores29PredictionComponent from '@/components/WhoScores29Prediction.vue'
import TeamPlayerList from '@/components/TeamPlayerList.vue'
import { useGameStore } from '@/stores/gameStore'
import { ref, onMounted } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import { gameService } from '@/services/gameService'
import type { Game, Player, ScoreLeaderResult, WhoScores29Prediction } from '@/types'

const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()
const game = ref<Game>()
const players = ref<Player[]>()

const teamStore = useTeamStore()

const scoreLeaderResult = ref<ScoreLeaderResult>({
  gameId,
  scoreLeaders: [],
})
const selectedLeaders = ref<Player[]>([])
const whoScores29Result = ref<WhoScores29Prediction>({
  gameId,
  whoScores29: undefined,
})

onMounted(async () => {
  console.log('gameId', gameId)
  game.value = await gameStore.fetchGame(gameId)
  players.value = await teamStore.fetchPlayers('694', game.value?.date)
  scoreLeaderResult.value = await gameService.fetchScoreLeaders(gameId)
})

const updateScoreLeader = async ({ player, checked }: { player: Player; checked: boolean }) => {
  if (checked) {
    selectedLeaders.value.push(player)
  } else {
    selectedLeaders.value = selectedLeaders.value.filter((p) => p.id !== player.id)
  }

  await gameService.updateScoreLeaders(
    gameId,
    selectedLeaders.value.map((p) => p.id),
  )
}

const updateWhoGets29 = async () => {
  if (!whoScores29Result.value) {
    return
  }
  await gameService.updateWhoScores29(gameId, whoScores29Result.value.whoScores29 ?? '')
}
</script>

<template>
  <div v-if="game">
    <GameSummary :game="game" />
    <h3>スコアリーダー</h3>
    <!-- <ScoreLeaderPrediction
      :game="game"
      :players="players"
      v-model="scoreLeaderResult"
      v-if="players"
    /> -->
    <TeamPlayerList
      :players="players"
      :team="game.team1"
      v-if="players"
      :selectedPlayer="selectedLeaders"
      :isMultiSelect="true"
      @multi-change="updateScoreLeader"
    ></TeamPlayerList>
    <h3>29点目</h3>
    <WhoScores29PredictionComponent
      :game="game"
      :players="players"
      v-model="whoScores29Result.whoScores29"
      v-if="players"
      @update:model-value="updateWhoGets29"
    />
  </div>
</template>
