/// <reference types="vite/client" />
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from '@/plugins/vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

if (import.meta.env.DEV) {
  const { worker } = await import('@/mock/browser')
  await worker.start()
  app.mount('#app')
} else {
  app.mount('#app')
}
