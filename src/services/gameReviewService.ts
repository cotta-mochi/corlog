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
import type { Game, Review, ReviewImage } from '@/types'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, ref as stRef, uploadBytes } from 'firebase/storage'
import { storage } from '@/firebase_settings'

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

const updateReview = async (review: Review, images?: File[]) => {
  if (!review.id) throw new Error('Review ID is required')
  const docRef = doc(db, 'reviews', review.id)
  await setDoc(docRef, { ...review, updatedAt: serverTimestamp() })
  if (!images) {
    return
  }
  const reviewImages = await uploadImages(review.gameId, images)

  const imageCollection = collection(docRef.firestore, docRef.path, 'images')
  const promises = reviewImages.map((image) => {
    return addDoc(imageCollection, image)
  })
  return await Promise.all(promises)
}

const deleteReview = async (reviewId: Review['id']) => {
  if (!reviewId) throw new Error('Review ID is required')
  const docRef = doc(db, 'reviews', reviewId)
  await deleteDoc(docRef)
}

const fetchImages = async (reviewId: Review['id']) => {
  if (!reviewId) throw new Error('Review ID is required')
  const imagesRef = collection(db, 'reviews', reviewId, 'images')
  const snapshot = await getDocs(imagesRef)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ReviewImage[]
}

const uploadImages = async (gameId: Game['id'], images: File[]) => {
  if (!auth.currentUser) throw new Error('User is not logged in')
  const compressOptions = {
    maxSizeMb: 1,
    useWebWorker: true,
  }
  const path = `game/${gameId}/${auth.currentUser.uid}/images`
  const promises = images.map(async (image) => {
    if (!auth.currentUser) throw new Error('User is not logged in')
    const compressed = await imageCompression(image, compressOptions)
    const storageRef = stRef(storage, `${path}/${image.name}`)
    const result = await uploadBytes(storageRef, compressed)
    return {
      url: await getDownloadURL(result.ref),
      path: result.ref.fullPath,
      gameId,
      uid: auth.currentUser.uid,
      uploadedAt: new Date(),
    }
  })
  return await Promise.all(promises)
}

export const gameReviewService = {
  fetchReviewsByGameId,
  fetchMyReviews,
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
  uploadImages,
  fetchImages,
}
