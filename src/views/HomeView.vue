<script setup lang="ts">
import GameList from '../components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { computed, onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import type { Player, Team, Game } from '@/types'
import GamePrediction from '@/components/GamePrediction.vue'
import GameSummary from '@/components/GameSummary.vue'
import GamePredictionResult from '@/components/GamePredictionResult.vue'

const gameStore = useGameStore()
const teamStore = useTeamStore()

const players = ref<Player[]>([])
const teamId = ref<Team['id']>('694')
const team = ref<Team>()
const todayGame = ref<Game | undefined>()
const nextGame = ref<Game | undefined>()

const gameTab = ref(null)

const topGame = computed(() => {
  return todayGame.value ?? nextGame.value
})

const upcomingGames = computed(() => {
  return gameStore.games
    .filter((game) => game.status === 'upcoming')
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
})

const finishedGames = computed(() => {
  return gameStore.games
    .filter((game) => game.status === 'finished')
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
})

const recentGames = computed(() => {
  return finishedGames.value
    .map((v) => v)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5)
})

onMounted(async () => {
  todayGame.value = await gameStore.fetchTodayGame()
  if (todayGame.value === undefined) {
    nextGame.value = await gameStore.fetchNextGame(new Date())
  }
  await gameStore.fetchGames()
  team.value = await teamStore.fetchTeam(teamId.value)
  players.value = await teamStore.fetchPlayers(teamId.value)
})
</script>

<template>
  <main>
    <GameSummary :game="topGame" :show-timer="topGame.status === 'upcoming'" v-if="topGame" />
    <GamePrediction :game="topGame" v-if="topGame && topGame.status === 'upcoming'" />
    <GamePredictionResult
      :game="topGame"
      :players="players"
      v-if="topGame && topGame.status !== 'upcoming'"
      class="mb-10"
    />
    <h2 class="corlog-heading-b mt-10">試合情報</h2>
    <v-tabs v-model="gameTab" align-tabs="center" color="secondary">
      <v-tab value="upcomingGame" v-if="upcomingGames.length > 0">今後の試合</v-tab>
      <v-tab value="recentGame">直近5試合</v-tab>
      <v-tab value="finishedGame">終了した試合</v-tab>
    </v-tabs>
    <v-window v-model="gameTab">
      <v-window-item value="upcomingGame" v-if="upcomingGames.length > 0">
        <GameList :games="upcomingGames" />
      </v-window-item>
      <v-window-item value="recentGame">
        <GameList :games="recentGames" />
      </v-window-item>
      <v-window-item value="finishedGame">
        <GameList :games="finishedGames" />
      </v-window-item>
    </v-window>
  </main>
</template>
