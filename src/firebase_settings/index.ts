// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA52G6LsA-NvRVcKuOWI8U20mEqhdZBpWA',
  authDomain: 'corlog-1364e.firebaseapp.com',
  projectId: 'corlog-1364e',
  storageBucket: 'corlog-1364e.firebasestorage.app',
  messagingSenderId: '330748980231',
  appId: '1:330748980231:web:eb7512b49efc17aadccea2',
  measurementId: 'G-QGNEF5J6R3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getFirestore(app)
const auth = getAuth(app)

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

export { analytics, db, auth, callFunction }
