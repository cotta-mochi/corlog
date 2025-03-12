import type { Game, GameMvp, GameSatisfaction } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, auth } from '@/firebase_settings/index'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where,
  query,
  orderBy,
  limit,
  type DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore'

export const useGameStore = defineStore('game', () => {
  const games = ref<Game[]>([])

  const processFetchData = (doc: DocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    if (!data) {
      throw new Error('データがありません')
    }
    return { ...data, date: data.date.toDate() } as Game
  }
  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, 'games'))
    games.value = snapshot.docs.map((doc) => processFetchData(doc))
  }

  const fetchGame = async (gameId: Game['id']) => {
    const key = `gameId_${gameId}`
    const docRef = doc(db, 'games', key)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return processFetchData(docSnap)
    } else {
      throw new Error('データがありません')
    }
  }

  const fetchNextGame = async (targetDate: Date) => {
    const q = query(
      collection(db, 'games'),
      where('date', '>=', targetDate),
      orderBy('date', 'asc'),
      limit(1), // 1件だけ取得
    )
    const snapshot = await getDocs(q)
    const games = snapshot.docs.map((doc) => processFetchData(doc))
    return games.length > 0 ? (games[0] as Game) : undefined
  }

  const generateKey = (gameId: Game['id']): string => {
    return `uid_${auth.currentUser?.uid}_gameId_${gameId}`
  }

  const fetchGameSatisfaction = async (gameId: Game['id']) => {
    const key = generateKey(gameId)
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

  const fetchGameMvps = async (gameId: Game['id']) => {
    if (!auth.currentUser) {
      return {
        gameId,
        player: undefined,
        reason: '',
      }
    }
    const key = generateKey(gameId)
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

  const updateGameSatisfaction = async (gameId: Game['id'], satisfaction: number) => {
    if (!auth.currentUser) {
      return
    }
    const key = generateKey(gameId)
    const docRef = doc(db, 'gameSatisfactions', key)
    await setDoc(
      docRef,
      { gameId, satisfaction, uid: auth.currentUser.uid, timestamp: serverTimestamp() },
      { merge: true },
    )
  }

  const updateGameMvp = async (gameId: Game['id'], mvp: GameMvp | undefined) => {
    if (!auth.currentUser) {
      return
    }
    const key = generateKey(gameId)
    const docRef = doc(db, 'gameMvps', key)
    await setDoc(docRef, { gameId, player: mvp?.player, reason: mvp?.reason }, { merge: true })
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
