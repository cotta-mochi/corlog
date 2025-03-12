<script setup lang="ts">
import GameList from '../components/GameList.vue'
import { useGameStore } from '@/stores/gameStore'
import { onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import type { Player, Team, Game } from '@/types'
import { auth } from '@/firebase_settings/index'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import type { User } from 'firebase/auth'
import GamePrediction from '@/components/GamePrediction.vue'
const gameStore = useGameStore()
const teamStore = useTeamStore()

const players = ref<Player[]>([])
const teamId = ref<Team['id']>('694')
const team = ref<Team>()
const user = ref<User | null>()
const router = useRouter()
const nextGame = ref<Game | undefined>()
onMounted(async () => {
  nextGame.value = await gameStore.fetchNextGame(new Date())
  await gameStore.fetchGames()
  team.value = await teamStore.fetchTeam(teamId.value)
  players.value = await teamStore.fetchPlayers(teamId.value)
  user.value = auth.currentUser
})
const logout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>

<template>
  <main>
    <div>
      <p>{{ user?.email ?? 'ログインしてください' }}</p>
      <button @click="logout">ログアウト</button>
    </div>
    <GamePrediction :game="nextGame" v-if="nextGame" />
    <GameList :games="gameStore.games" />
  </main>
</template>
