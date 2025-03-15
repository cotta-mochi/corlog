import { db } from '@/firebase_settings/index'
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import type { Team, Player } from '@/types'

const fetchTeam = async (teamId: Team['id']) => {
  const docRef = doc(db, 'teams', `teamId_${teamId}`)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as Team
  } else {
    throw new Error('No such document!')
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
  const playersQuery = query(
    collection(db, 'teamPlayersSnapshots'),
    where('teamId', '==', teamId),
    where('snapshotDate', '<=', targetDate.toISOString().slice(0, 10)),
    orderBy('snapshotDate', 'desc'),
    limit(1),
  )

  const playersSnapshot = await getDocs(playersQuery)
  if (playersSnapshot.empty) {
    return await fetchLatestPlayers()
  }
  return playersSnapshot.docs
    .map((doc) => doc.data())[0]
    .players.sort((a: Player, b: Player) => Number(a.number) - Number(b.number))
}

export const teamService = {
  fetchTeam,
  fetchPlayers,
}
