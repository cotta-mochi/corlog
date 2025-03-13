import { computed, ref, onMounted } from 'vue'
import { auth } from '../firebase_settings/index'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(auth.currentUser)

  const isLoggedIn = computed(() => user.value !== null)

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  onMounted(() => {
    onAuthStateChanged(auth, (newUser) => {
      user.value = newUser
    })
  })

  return { user, isLoggedIn, login, logout }
})
