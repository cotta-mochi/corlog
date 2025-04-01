<script setup lang="ts">
import { useGameListViewStore } from '@/stores/gameListViewStore'
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const isMenuOpen = ref(false)
const gameListViewStore = useGameListViewStore()
const router = useRouter()
const gotoGames = () => {
  gameListViewStore.reset()
  router.push('/games')
}
</script>
<template>
  <header class="corlog-app__header">
    <v-app-bar :elevation="2" color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="isMenuOpen = !isMenuOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title
        ><router-link to="/" class="corlog-app__title">CORLOG 🏴‍☠️</router-link></v-app-bar-title
      >
      <template v-slot:append>
        <v-menu v-if="userStore.isLoggedIn">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="userStore.logout">
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else to="/login" :stacked="true" size="small">
          <template v-slot:prepend>
            <v-icon>mdi-login</v-icon>
          </template>
          <template v-slot:default>
            <span>ログイン</span>
          </template>
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="isMenuOpen" location="start" temporary>
      <v-list-item :title="userStore.user?.email ?? ''"></v-list-item>
      <v-list nav>
        <v-list-item to="/">Home</v-list-item>
        <v-list-item @click="gotoGames">Games</v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/admin">Admin</v-list-item>
        <v-list-item to="/admin/games">Admin Games</v-list-item>
      </v-list>
    </v-navigation-drawer>
  </header>
</template>

<style scoped lang="scss">
.corlog-app__title {
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
