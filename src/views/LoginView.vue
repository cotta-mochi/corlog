<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '../firebase_settings/index'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    alert('ログインに成功しました')
    router.push('/')
  } catch (error) {
    alert('ログインに失敗しました')
    console.error(error)
  }
}
</script>
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" placeholder="Email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
