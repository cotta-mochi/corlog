import { db, auth } from '@/firebase_settings/index'
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
import type { Game, GameMvp, GameSatisfaction } from '@/types'

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

export const gameService = {
  fetchGames,
  fetchGame,
  fetchNextGame,
  fetchGameSatisfaction,
  updateGameSatisfaction,
  fetchGameMvps,
  updateGameMvp,
}
