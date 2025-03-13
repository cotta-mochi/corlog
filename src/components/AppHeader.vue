<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
<template>
  <header class="corlog-app__header">
    <v-app-bar :elevation="2" color="primary" density="compact">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>CORLOG</v-app-bar-title>
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
  </header>
</template>
