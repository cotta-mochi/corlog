<script setup lang="ts">
import { ref } from 'vue'
import { registerGame, registerTeam, registerTeamPlayers, createSnapshot } from '@/mock/restore'

const isLoading = ref(false)

const execute = async (fn: () => Promise<void>) => {
  isLoading.value = true
  try {
    await fn()
    alert('完了しました')
  } catch (error) {
    console.error(error)
    alert('エラーが発生しました')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Admin</h1>
    <div class="mb-4">
      <v-btn :loading="isLoading" :disabled="isLoading" @click="execute(registerGame)"
        >ゲーム登録</v-btn
      >
    </div>
    <div class="mb-4">
      <v-btn :loading="isLoading" :disabled="isLoading" @click="execute(registerTeam)"
        >チーム登録</v-btn
      >
    </div>
    <div class="mb-4">
      <v-btn :loading="isLoading" :disabled="isLoading" @click="execute(registerTeamPlayers)"
        >チームプレイヤー登録</v-btn
      >
    </div>
    <div class="mb-4">
      <v-btn :loading="isLoading" :disabled="isLoading" @click="execute(createSnapshot)"
        >スナップショット作成</v-btn
      >
    </div>
  </div>
</template>
