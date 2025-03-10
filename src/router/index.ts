import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameList from '../components/GameList.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/game/:gameId/blog/add',
      name: 'blog-add',
      component: () => import('@/views/BlogEditView.vue'),
      props: true,
    },
    {
      path: '/game/:gameId/blog/:blogId/edit',
      name: 'blog-edit',
      component: () => import('@/views/BlogEditView.vue'),
      props: true,
    },
  ],
})

export default router
