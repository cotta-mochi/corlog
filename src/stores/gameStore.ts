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
    const docRef = doc(db, 'games', gameId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as Game
    } else {
      console.log('No such document!')
      return undefined
    }
  }

  const generateKey = (gameId: Game['id']): string => {
    return `${auth.currentUser?.uid}_${gameId}`
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
    const response = await fetch(`/api/game/${gameId}/mvp`)
    return await response.json()
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
    await fetch(`/api/game/${gameId}/mvp`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mvp),
    })
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
