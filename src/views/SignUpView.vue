<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { nameRules, emailRules, passwordRules } from '@/services/userValidateRules'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const isLoading = ref(false)

const passwordConfirmationRules = [
  ...passwordRules,
  (v: string) => v === password.value || 'パスワードが一致しません',
]
const router = useRouter()
const signUp = async () => {
  isLoading.value = true
  try {
    await useUserStore().signUp({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    router.push('/')
  } catch (error) {
    alert('アカウント作成に失敗しました')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="inline-padding">
    <h1 class="corlog-heading">アカウント作成</h1>
    <v-form @submit.prevent="signUp">
      <v-text-field
        v-model="name"
        label="アカウント名"
        required
        density="compact"
        variant="outlined"
        class="mt-4"
        :rules="nameRules"
      />
      <v-text-field
        v-model="email"
        type="email"
        label="メールアドレス"
        :rules="emailRules"
        required
        density="compact"
        variant="outlined"
        class="mt-4"
      />
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="パスワード"
        :rules="passwordRules"
        required
        density="compact"
        variant="outlined"
        class="mt-4"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
      />
      <v-text-field
        v-model="passwordConfirmation"
        :type="showPasswordConfirmation ? 'text' : 'password'"
        label="パスワード（確認用）"
        :rules="passwordConfirmationRules"
        required
        density="compact"
        variant="outlined"
        class="mt-4"
        :append-inner-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
      />
      <v-btn type="submit" color="primary" flat :loading="isLoading" class="mt-10" block
        >アカウント作成</v-btn
      >
    </v-form>
  </div>
</template>
