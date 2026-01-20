import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('../view/register.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../view/index.vue')
    },
    {
      path: '/create-board',
      name: 'create-board',
      component: () => import('../view/create-board.vue')
    },
    {
      path: '/like-board',
      name: 'like-board',
      component: () => import('../view/like-board.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../view/login.vue'),
    },
    {
      path: '/public-boards',
      name: 'public-boards',
      component: () => import('../view/public-boards.vue')
    },
    {
      path: '/share-board',
      name: 'share-board',
      component: () => import('../view/share-board.vue')
    },
    {
      path: '/update-board',
      name: 'update-board',
      component: () => import('../view/update-board.vue')
    },
    {
      path: '/view-board',
      name: 'view-board',
      component: () => import('../view/view-board.vue')
    },
    {
      path: '/view-by-hash',
      name: 'view-by-hash',
      component: () => import('../view/view-by-hash.vue')
    },
  ],
})

export default router
