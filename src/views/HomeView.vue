<script setup lang="ts">
import GameList from '../components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import type { Player, Team } from '@/types'
const gameStore = useGameStore()
const teamStore = useTeamStore()

const players = ref<Player[]>([])
const teamId = ref<Team['id']>('694')
const team = ref<Team>()

onMounted(async () => {
  await gameStore.fetchGames()
  team.value = await teamStore.fetchTeam(teamId.value)
  players.value = await teamStore.fetchPlayers(teamId.value)
})
</script>

<template>
  <main>
    <GameList :games="gameStore.games" />
  </main>
</template>
