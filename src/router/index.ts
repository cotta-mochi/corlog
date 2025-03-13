import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameList from '../components/GameList.vue'
import { useUserStore } from '@/stores/userStore'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const redirectAuthenticated = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const userStore = useUserStore()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (userStore.isLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      beforeEnter: redirectAuthenticated,
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpView.vue'),
      beforeEnter: redirectAuthenticated,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/games',
      name: 'games',
      component: GameList,
    },
    {
      path: '/game/:gameId',
      name: 'game-detail',
      component: () => import('@/views/GameDetailView.vue'),
      props: true,
    },
    {
      path: '/game/:gameId/review/add',
      name: 'review-add',
      component: () => import('@/views/ReviewEditView.vue'),
      props: true,
    },
    {
      path: '/game/:gameId/review/:reviewId/edit',
      name: 'review-edit',
      component: () => import('@/views/ReviewEditView.vue'),
      props: true,
    },
  ],
})

export default router
