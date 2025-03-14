import type { Team, Player } from '@/types'
import { defineStore } from 'pinia'
import { teamService } from '@/services/teamService'
import { ref } from 'vue'
import { format } from 'date-fns'

export const useTeamStore = defineStore('team', () => {
  const teamCache = ref<Map<Team['id'], Team>>(new Map())
  const playersCache = ref<Map<Team['id'], Player[]>>(new Map())

  const fetchTeam = async (teamId: Team['id']) => {
    if (teamCache.value.has(teamId)) {
      return teamCache.value.get(teamId)
    } else {
      const team = await teamService.fetchTeam(teamId)
      teamCache.value.set(teamId, team)
      return team
    }
  }

  const fetchPlayers = async (teamId: Team['id'], targetDate?: Date) => {
    const cacheKey = targetDate ? `${teamId}_${format(targetDate, 'yyyMMdd')}` : 'latest'
    if (playersCache.value.has(cacheKey)) {
      return playersCache.value.get(cacheKey)
    } else {
      const players = await teamService.fetchPlayers(teamId, targetDate)
      playersCache.value.set(cacheKey, players)
      return players
    }
  }

  return { fetchTeam, fetchPlayers }
})
