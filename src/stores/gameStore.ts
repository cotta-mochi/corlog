import type { Game, GameMvp, GameSatisfaction } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, auth } from '@/firebase_settings/index'
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export const useGameStore = defineStore('game', () => {
  const games = ref<Game[]>([])

  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, 'games'))
    games.value = snapshot.docs.map((doc) => doc.data() as Game)
  }

  const fetchGame = async (gameId: Game['id']) => {
    const key = `gameId_${gameId}`
    const docRef = doc(db, 'games', key)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as Game
    } else {
      console.log('No such document!')
      return undefined
    }
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
    fetchGameSatisfactions: fetchGameSatisfaction,
    fetchGameMvps,
    updateGameSatisfaction,
    updateGameMvp,
  }
})
