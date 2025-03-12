import type { Team } from '@/types'
import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useTeamStore = defineStore('team', () => {
  const fetchTeam = async (teamId: Team['id']) => {
    return await api.fetchTeam(teamId)
  }

  const fetchPlayers = async (teamId: Team['id'], targetDate?: Date) => {
    return await api.fetchPlayers(teamId, targetDate)
  }

  return { fetchTeam, fetchPlayers }
})
