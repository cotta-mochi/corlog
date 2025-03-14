import { computed, ref } from 'vue'
import { auth } from '../firebase_settings/index'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import type { SignUpUser, Profile } from '@/types'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const user = ref(auth.currentUser)
  const profile = ref<Profile | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  const signUp = async (user: SignUpUser) => {
    await createUserWithEmailAndPassword(auth, user.email, user.password)
    if (!auth.currentUser) throw new Error('ユーザーが見つかりません')
    await userService.createUser(auth.currentUser.uid, {
      uid: auth.currentUser.uid,
      name: user.name,
      email: user.email,
    })
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const fetchProfile = async () => {
    if (!auth.currentUser) throw new Error('ユーザーが見つかりません')
    profile.value = await userService.fetchUser(auth.currentUser.uid)
  }

  // 認証状態の変更を監視
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser
    if (newUser) {
      fetchProfile()
    } else {
      profile.value = null
    }
  })

  return { user, profile, isLoggedIn, login, logout, signUp }
})
