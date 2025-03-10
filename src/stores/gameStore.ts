import type { Game } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const games = ref<Game[]>([])

  const fetchGames = async () => {
    const response = await fetch('/api/game')
    games.value = await response.json()
  }

  const fetchGame = async (gameId: string) => {
    const response = await fetch(`/api/game/${gameId}`)
    return await response.json()
  }

  return { games, fetchGames, fetchGame }
})
