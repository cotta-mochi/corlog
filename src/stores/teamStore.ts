import { db } from '@/firebase_settings'
import { doc, getDoc } from 'firebase/firestore'
import type { Team, TeamPlayersLog } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTeamStore = defineStore('team', () => {
  const teamPlayersLog = ref<TeamPlayersLog[]>([])

  const fetchTeam = async (teamId: Team['id']) => {
    const docRef = doc(db, 'teams', teamId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as Team
    } else {
      console.log('No such document!')
      return undefined
    }
  }

  const fetchPlayers = async (teamId: Team['id']) => {
    const response = await fetch(`/api/team/${teamId}/players`)
    return await response.json()
  }

  return { teamPlayersLog, fetchTeam, fetchPlayers }
})
