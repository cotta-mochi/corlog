import type { Game, GameMvp } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useGameStore = defineStore('game', () => {
  const games = ref<Game[]>([])

  const fetchGames = async () => {
    games.value = await api.fetchGames()
  }
  const fetchGame = async (gameId: Game['id']) => {
    return await api.fetchGame(gameId)
  }

  const fetchNextGame = async (targetDate: Date) => {
    return await api.fetchNextGame(targetDate)
  }

  const fetchGameSatisfaction = async (gameId: Game['id']) => {
    return await api.fetchGameSatisfaction(gameId)
  }

  const fetchGameMvps = async (gameId: Game['id']) => {
    return await api.fetchGameMvps(gameId)
  }

  const updateGameSatisfaction = async (gameId: Game['id'], satisfaction: number) => {
    return await api.updateGameSatisfaction(gameId, satisfaction)
  }

  const updateGameMvp = async (gameId: Game['id'], mvp: GameMvp | undefined) => {
    return await api.updateGameMvp(gameId, mvp)
  }

  return {
    games,
    fetchGames,
    fetchGame,
    fetchNextGame,
    fetchGameSatisfaction,
    fetchGameMvps,
    updateGameSatisfaction,
    updateGameMvp,
  }
})
