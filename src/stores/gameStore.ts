import type { Game, GameMvp } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { gameService } from '@/services/gameService'

export const useGameStore = defineStore('game', () => {
  const cache = ref<Map<Game['id'], Game>>(new Map())
  const games = computed(() => Array.from(cache.value.values()))

  const fetchGames = async () => {
    ;(await gameService.fetchGames()).forEach((game) => {
      cache.value.set(game.id, game)
    })
  }

  const fetchGame = async (gameId: Game['id']) => {
    if (cache.value.has(gameId)) {
      return cache.value.get(gameId)
    } else {
      const game = await gameService.fetchGame(gameId)
      cache.value.set(gameId, game)
      return game
    }
  }

  const fetchNextGame = async (targetDate: Date) => {
    if (games.value.length === 0) {
      return await gameService.fetchNextGame(targetDate)
    }
    const clonedGames = [...games.value].sort((a, b) => a.date.getTime() - b.date.getTime())
    return clonedGames.find((game) => game.date > targetDate)
  }

  const fetchGameSatisfaction = async (gameId: Game['id']) => {
    return await gameService.fetchGameSatisfaction(gameId)
  }

  const fetchGameMvps = async (gameId: Game['id']) => {
    return await gameService.fetchGameMvps(gameId)
  }

  const updateGameSatisfaction = async (gameId: Game['id'], satisfaction: number) => {
    return await gameService.updateGameSatisfaction(gameId, satisfaction)
  }

  const updateGameMvp = async (gameId: Game['id'], mvp: GameMvp | undefined) => {
    return await gameService.updateGameMvp(gameId, mvp)
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
