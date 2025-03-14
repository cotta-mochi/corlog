import { db, auth } from '@/firebase_settings/index'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type {
  Game,
  Player,
  WinnerPrediction,
  Team,
  ScoreLeaderPrediction,
  WhoScores29Prediction,
} from '@/types'

const generateGamePredictionKey = (gameId: Game['id']): string => {
  return `uid_${auth.currentUser?.uid}_gameId_${gameId}`
}

const fetchMyWinnerPrediction = async (gameId: Game['id']) => {
  if (!auth.currentUser) {
    return {
      gameId,
      winnerTeamId: undefined,
    }
  }
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'winnerPredictions', key)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as WinnerPrediction
  } else {
    return {
      gameId,
      winnerTeamId: undefined,
    }
  }
}

const updateMyWinnerPrediction = async (
  gameId: Game['id'],
  winnerTeamId: Team['id'] | undefined,
) => {
  if (!auth.currentUser) {
    return
  }
  console.log('updateMyWinnerPrediction', { gameId, winnerTeamId })
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'winnerPredictions', key)
  await setDoc(docRef, { gameId, winnerTeamId }, { merge: true })
}

const fetchMyScoreLeaderPrediction = async (gameId: Game['id']) => {
  if (!auth.currentUser) {
    return {
      gameId,
      scoreLeader: undefined,
    }
  }
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'scoreLeaderPredictions', key)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as ScoreLeaderPrediction
  } else {
    return {
      gameId,
      scoreLeader: undefined,
    }
  }
}

const updateMyScoreLeaderPrediction = async (
  gameId: Game['id'],
  scoreLeader: Player['id'] | undefined,
) => {
  if (!auth.currentUser) {
    return
  }
  console.log('updateMyScoreLeaderPrediction', { gameId, scoreLeader })
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'scoreLeaderPredictions', key)
  await setDoc(docRef, { gameId, scoreLeader }, { merge: true })
}

const fetchMyWhoScores29Prediction = async (gameId: Game['id']) => {
  if (!auth.currentUser) {
    return {
      gameId,
      whoScores29: undefined,
    }
  }
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'whoScores29Predictions', key)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as WhoScores29Prediction
  } else {
    return {
      gameId,
      whoScores29: undefined,
    }
  }
}

const updateMyWhoScores29Prediction = async (
  gameId: Game['id'],
  whoScores29: Player['id'] | undefined,
) => {
  if (!auth.currentUser) {
    return
  }
  const key = generateGamePredictionKey(gameId)
  const docRef = doc(db, 'whoScores29Predictions', key)
  await setDoc(docRef, { gameId, whoScores29 }, { merge: true })
}

export const gamePredictionService = {
  fetchMyWinnerPrediction,
  updateMyWinnerPrediction,
  fetchMyScoreLeaderPrediction,
  updateMyScoreLeaderPrediction,
  fetchMyWhoScores29Prediction,
  updateMyWhoScores29Prediction,
}
