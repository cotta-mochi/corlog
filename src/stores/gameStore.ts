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

  const fetchGameSatisfactions = async (gameId: string) => {
    const response = await fetch(`/api/game-satisfaction/${gameId}`)
    return await response.json()
  }

  const updateGameSatisfaction = async (gameId: string, satisfaction: number) => {
    await fetch(`/api/game-satisfaction/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, satisfaction }),
    })
  }

  return { games, fetchGames, fetchGame, fetchGameSatisfactions, updateGameSatisfaction }
})
