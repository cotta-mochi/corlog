import { db, auth, callFunction } from '@/firebase_settings/index'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore'
import type {
  Game,
  GameMvp,
  GameSatisfaction,
  Player,
  ScoreLeaderResult,
  WhoScores29Result,
  Team,
} from '@/types'

const processGameData = (doc: DocumentSnapshot<DocumentData>): Game => {
  const data = doc.data()
  if (!data) {
    throw new Error('データがありません')
  }
  return { id: doc.id, ...data, date: data.date.toDate() } as Game
}

const fetchGames = async () => {
  const gamesRef = collection(db, 'games')
  const gamesSnapshot = await getDocs(gamesRef)
  const games = gamesSnapshot.docs.map((doc) => processGameData(doc))
  return games
}

const fetchGame = async (gameId: Game['id']) => {
  const gameRef = doc(db, 'games', `gameId_${gameId}`)
  const gameDoc = await getDoc(gameRef)
  const game = processGameData(gameDoc)
  return game
}

const fetchTodayGame = async () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const q = query(
    collection(db, 'games'),
    where('date', '>=', today),
    where('date', '<', tomorrow),
    orderBy('date', 'asc'),
    limit(1), // 1件だけ取得
  )
  const snapshot = await getDocs(q)
  const games = snapshot.docs.map((doc) => processGameData(doc))
  return games.length > 0 ? (games[0] as Game) : undefined
}

const fetchNextGame = async (targetDate: Date) => {
  const q = query(
    collection(db, 'games'),
    where('date', '>=', targetDate),
    orderBy('date', 'asc'),
    limit(1), // 1件だけ取得
  )
  const snapshot = await getDocs(q)
  const games = snapshot.docs.map((doc) => processGameData(doc))
  return games.length > 0 ? (games[0] as Game) : undefined
}

const generateGameSatisfactionKey = (gameId: Game['id']): string => {
  return `uid_${auth.currentUser?.uid}_gameId_${gameId}`
}

const fetchGameSatisfaction = async (gameId: Game['id']) => {
  const key = generateGameSatisfactionKey(gameId)
  const docRef = doc(db, 'gameSatisfactions', key)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as GameSatisfaction
  } else {
    return {
      gameId,
      satisfaction: 0,
    }
  }
}

const updateGameSatisfaction = async (gameId: Game['id'], satisfaction: number) => {
  if (!auth.currentUser) {
    return
  }
  const key = generateGameSatisfactionKey(gameId)
  const docRef = doc(db, 'gameSatisfactions', key)
  await setDoc(
    docRef,
    { gameId, satisfaction, uid: auth.currentUser.uid, timestamp: serverTimestamp() },
    { merge: true },
  )
}

const generateGameMvpKey = (gameId: Game['id']): string => {
  return `uid_${auth.currentUser?.uid}_gameId_${gameId}`
}

const fetchGameMvps = async (gameId: Game['id']) => {
  if (!auth.currentUser) {
    return {
      gameId,
      player: undefined,
      reason: '',
    }
  }
  const key = generateGameMvpKey(gameId)
  const docRef = doc(db, 'gameMvps', key)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as GameMvp
  } else {
    return {
      gameId,
      player: undefined,
      reason: '',
    }
  }
}

const updateGameMvp = async (gameId: Game['id'], mvp: GameMvp | undefined) => {
  if (!auth.currentUser) {
    return
  }
  const key = generateGameMvpKey(gameId)
  const docRef = doc(db, 'gameMvps', key)
  await setDoc(docRef, { gameId, player: mvp?.player, reason: mvp?.reason }, { merge: true })
}

const getWinnerTeam = (game: Game): Team | undefined => {
  if (game.status !== 'finished' || game.scores === undefined) {
    return undefined
  }
  const totalScores = game.scores.reduce(
    (acc, score) => {
      acc.team1 += score.team1
      acc.team2 += score.team2
      return acc
    },
    { team1: 0, team2: 0 },
  )
  return totalScores.team1 > totalScores.team2 ? game.team1 : game.team2
}

const fetchScoreLeaders = async (gameId: Game['id']): Promise<ScoreLeaderResult> => {
  const docRef = doc(db, 'scoreLeaders', `gameId_${gameId}`)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as ScoreLeaderResult
  } else {
    return {
      gameId,
      scoreLeaders: undefined,
    }
  }
}

const updateScoreLeaders = async (gameId: Game['id'], scoreLeaders: Player['id'][]) => {
  console.log('updateScoreLeaders', { gameId, scoreLeaders })
  const docRef = doc(db, 'scoreLeaders', `gameId_${gameId}`)
  await setDoc(docRef, {
    gameId,
    scoreLeaders,
  })
}

const fetchWhoScores29 = async (gameId: Game['id']) => {
  const docRef = doc(db, 'whoScores29s', `gameId_${gameId}`)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as WhoScores29Result
  } else {
    return undefined
  }
}

const updateWhoScores29 = async (gameId: Game['id'], whoScores29: Player['id']) => {
  const docRef = doc(db, 'whoScores29s', `gameId_${gameId}`)
  await setDoc(docRef, { gameId, whoScores29 })
}

const updateScore = async (scheduleKey: Game['scheduleKey']) => {
  try {
    await callFunction('updateGameScoreByGameId', { scheduleKey })
  } catch (error) {
    console.error(error)
  }
}

const updateStats = async (scheduleKey: Game['scheduleKey']) => {
  try {
    await callFunction('updateGameStatsOnCall', { scheduleKey })
  } catch (error) {
    console.error(error)
  }
}

export const gameService = {
  fetchGames,
  fetchGame,
  fetchTodayGame,
  fetchNextGame,
  fetchGameSatisfaction,
  updateGameSatisfaction,
  fetchGameMvps,
  updateGameMvp,
  getWinnerTeam,
  fetchScoreLeaders,
  updateScoreLeaders,
  fetchWhoScores29,
  updateWhoScores29,
  updateScore,
  updateStats,
}
