import { db, auth } from '@/firebase_settings/index'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import type { Game, Review } from '@/types'

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

export const gameReviewService = {
  fetchReviewsByGameId,
  fetchMyReviews,
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
}
