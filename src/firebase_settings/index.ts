// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

const functions = getFunctions(app, 'us-central1')

const callFunction = async (functionName: string, params?: object) => {
  try {
    // Call the Cloud Function
    console.log('Calling Cloud Function:', functionName, params)
    const fn = httpsCallable(functions, functionName)
    const result = await fn(params)
    return result
  } catch (error) {
    console.error('Error calling Cloud Function:', error)
    throw new Error('Error calling Cloud Function:' + functionName)
  }
}

export { analytics, db, auth, callFunction, storage }
