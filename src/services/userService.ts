import { db } from '@/firebase_settings/index'
import type { Profile } from '@/types'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

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

export const userService = {
  createUser,
  fetchUser,
}
