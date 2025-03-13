<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()
</script>

<template>
  <v-app class="corlog-app">
    <AppHeader />
    <v-main class="corlog-app__main">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.corlog-app__main {
  overflow: auto;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: #fff;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: #fff;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
