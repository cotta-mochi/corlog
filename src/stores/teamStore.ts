import type { Team, TeamPlayersLog } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTeamStore = defineStore('team', () => {
  const teamPlayersLog = ref<TeamPlayersLog[]>([])

  const fetchTeam = async (teamId: Team['id']) => {
    const response = await fetch(`/api/team/${teamId}`)
    return await response.json()
  }

  const fetchPlayers = async (teamId: Team['id']) => {
    const response = await fetch(`/api/team/${teamId}/players`)
    return await response.json()
  }

  return { teamPlayersLog, fetchTeam, fetchPlayers }
})
