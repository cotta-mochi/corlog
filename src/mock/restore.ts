import { collection, query, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase_settings'
import { getDocs, setDoc, where } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { games } from './data/games'
import { teamPlayersLog } from './data/teamPlayers'
import { teams } from './data/teams'

const registerGame = async () => {
  for (const game of games) {
    game.date = new Date(game.date)
    const gameRef = doc(db, `games`, `gameId_${game.id}`)
    await setDoc(gameRef, game)
    console.log(`${game.id}のゲームデータを登録しました`)
  }
}

const registerTeam = async () => {
  for (const team of teams) {
    const teamRef = doc(db, `teams`, `teamId_${team.id}`)
    await setDoc(teamRef, team)
    console.log(`${team.id}のチームデータを登録しました`)
  }
}

const registerTeamPlayers = async () => {
  for (const log of teamPlayersLog) {
    const teamId = log.teamId
    for (const player of log.players) {
      const key = `teamId_${teamId}_playerId_${player.id}`
      const teamPlayerRef = doc(db, `teamPlayers`, key)
      await setDoc(teamPlayerRef, {
        ...player,
        teamId,
        isActive: true,
        joinedAt: '2024-10-01',
        leftAt: null,
        updatedAt: serverTimestamp(),
      })
      console.log(`${player.id}のチームプレイヤーデータを登録しました`)
    }
  }
}

const createSnapshot = async () => {
  const now = new Date()
  const snapshotId = `teamId_694_${now.toISOString().slice(0, 10)}`

  const playersQuery = query(
    collection(db, 'teamPlayers'),
    where('teamId', '==', '694'),
    where('isActive', '==', true),
  )

  const playersSnapshot = await getDocs(playersQuery)
  const players = playersSnapshot.docs.map((doc) => doc.data())

  await setDoc(doc(db, 'teamPlayersSnapshots', snapshotId), {
    teamId: '694',
    snapshotDate: now.toISOString().slice(0, 10),
    players,
    createdAt: now,
  })
  console.log(`スナップショットを作成しました: ${snapshotId}`)
}

export { registerGame, registerTeam, registerTeamPlayers, createSnapshot }
