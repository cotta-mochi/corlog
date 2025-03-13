import { db, auth } from '@/firebase_settings/index'
import {
  collection,
  addDoc,
  deleteDoc,
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
  WinnerPrediction,
  Review,
  Team,
  ScoreLeaderPrediction,
  WhoScores29Prediction,
  Profile,
  AppUser,
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
  return playersSnapshot.docs
    .map((doc) => doc.data())[0]
    .players.sort((a: Player, b: Player) => Number(a.number) - Number(b.number))
}

const fetchReviewsByGameId = async (gameId: string) => {
  const q = query(collection(db, 'reviews'), where('gameId', '==', gameId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }) as Review,
  )
}

const fetchMyReviews = async (gameId?: Game['id']) => {
  const q =
    gameId === undefined
      ? query(collection(db, 'reviews'), where('uid', '==', auth.currentUser?.uid))
      : query(
          collection(db, 'reviews'),
          where('gameId', '==', gameId),
          where('uid', '==', auth.currentUser?.uid),
        )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }) as Review,
  )
}

const fetchReview = async (reviewId: string) => {
  const docRef = doc(db, 'reviews', reviewId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate(),
    } as Review
  }
  return null
}

const createReview = async (gameId: string, review: Review) => {
  await addDoc(collection(db, 'reviews'), {
    ...review,
    gameId,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

const updateReview = async (review: Review) => {
  if (!review.id) throw new Error('Review ID is required')
  const docRef = doc(db, 'reviews', review.id)
  await setDoc(docRef, { ...review, updatedAt: serverTimestamp() })
}

const deleteReview = async (reviewId: Review['id']) => {
  if (!reviewId) throw new Error('Review ID is required')
  const docRef = doc(db, 'reviews', reviewId)
  await deleteDoc(docRef)
}

const createUser = async (uid: string, user: Profile) => {
  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

const fetchUser = async (uid: string) => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return {
      ...docSnap.data(),
      createdAt: docSnap.data()?.createdAt?.toDate(),
      updatedAt: docSnap.data()?.updatedAt?.toDate(),
    } as Profile
  }
  return null
}

export const api = {
  fetchGames,
  fetchGame,
  fetchNextGame,
  fetchGameSatisfaction,
  fetchGameMvps,
  updateGameSatisfaction,
  updateGameMvp,
  fetchTeam,
  fetchPlayers,
  fetchReviewsByGameId,
  fetchMyReviews,
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
  fetchMyWinnerPrediction,
  updateMyWinnerPrediction,
  fetchMyScoreLeaderPrediction,
  updateMyScoreLeaderPrediction,
  fetchMyWhoScores29Prediction,
  updateMyWhoScores29Prediction,
  createUser,
  fetchUser,
}
