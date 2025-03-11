import { db } from '@/firebase_settings'
import { doc, getDoc, query, collection, where, getDocs, orderBy, limit } from 'firebase/firestore'
import type { Team, TeamPlayersLog, Player } from '@/types'
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

  const fetchPlayers = async (teamId: Team['id'], targetDate?: Date) => {
    const fetchLatestPlayers = async () => {
      const playersQuery = query(
        collection(db, 'teamPlayers'),
        where('teamId', '==', teamId),
        where('isActive', '==', true),
      )

      const playersSnapshot = await getDocs(playersQuery)
      return playersSnapshot.docs
        .map((doc) => doc.data() as Player)
        .sort((a: Player, b: Player) => Number(a.number) - Number(b.number))
    }
    if (targetDate === undefined) {
      return await fetchLatestPlayers()
    }
    console.log(targetDate)
    const playersQuery = query(
      collection(db, 'teamPlayersSnapshots'),
      where('teamId', '==', teamId),
      where('snapshotDate', '<=', targetDate.toISOString().slice(0, 10)),
      orderBy('snapshotDate', 'desc'),
      limit(1),
    )

    const playersSnapshot = await getDocs(playersQuery)
    return playersSnapshot.docs
      .map((doc) => doc.data())[0]
      .players.sort((a: Player, b: Player) => Number(a.number) - Number(b.number))
  }

  return { teamPlayersLog, fetchTeam, fetchPlayers }
})
