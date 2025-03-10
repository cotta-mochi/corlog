/// <reference types="vite/client" />
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (import.meta.env.DEV) {
  const { worker } = await import('@/mock/browser')
  await worker.start()
  app.mount('#app')
} else {
  app.mount('#app')
}
