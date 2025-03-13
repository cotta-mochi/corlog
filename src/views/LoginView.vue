<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { emailRules, passwordRules } from '@/services/userValidateRules'

const isLoading = ref(false)
const email = ref('')
const password = ref('')
const router = useRouter()
const login = async () => {
  try {
    // await signInWithEmailAndPassword(auth, email.value, password.value)
    isLoading.value = true
    await useUserStore().login(email.value, password.value)
    router.push('/')
  } catch (error) {
    alert('ログインに失敗しました')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="inline-padding">
    <h1 class="corlog-heading">ログイン</h1>
    <v-form fast-fail @submit.prevent="login">
      <v-text-field
        v-model="email"
        type="email"
        label="Email"
        :rules="emailRules"
        required
        density="compact"
        class="mt-4"
      />
      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        :rules="passwordRules"
        required
        density="compact"
        class="mt-4"
      />
      <v-btn type="submit" color="primary" flat :loading="isLoading" class="mt-10" block
        >ログイン</v-btn
      >
    </v-form>
    <div class="mt-4 d-flex justify-center">
      <v-btn flat to="/signup" color="primary" variant="text">
        アカウントを作成する
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>
