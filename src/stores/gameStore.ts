import type { Game, GameMvp } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const games = ref<Game[]>([])

  const fetchGames = async () => {
    const response = await fetch('/api/game')
    games.value = await response.json()
  }

  const fetchGame = async (gameId: Game['id']) => {
    const response = await fetch(`/api/game/${gameId}`)
    return await response.json()
  }

  const fetchGameSatisfactions = async (gameId: Game['id']) => {
    const response = await fetch(`/api/game/${gameId}/satisfaction`)
    return await response.json()
  }

  const fetchGameMvps = async (gameId: Game['id']) => {
    const response = await fetch(`/api/game/${gameId}/mvp`)
    return await response.json()
  }

  const updateGameSatisfaction = async (gameId: Game['id'], satisfaction: number) => {
    await fetch(`/api/game/${gameId}/satisfaction`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, satisfaction }),
    })
  }

  const updateGameMvp = async (gameId: Game['id'], mvp: GameMvp | undefined) => {
    await fetch(`/api/game/${gameId}/mvp`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mvp),
    })
  }

  return {
    games,
    fetchGames,
    fetchGame,
    fetchGameSatisfactions,
    fetchGameMvps,
    updateGameSatisfaction,
    updateGameMvp,
  }
})
