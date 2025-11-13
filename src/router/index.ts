import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/middleware/auth.guard'
import { permissionGuard } from '@/middleware/permission.guard'
import NDriveView from '@/views/ndrive/NDriveView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {

      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '/',
          redirect: '/dashboard'
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          beforeEnter: authGuard,
          meta: { requiresAuth: true, title: 'Dashboard' }
        },
        {
          path: '/drive',
          name: 'drive',
          component: NDriveView,
        },
        {
          path: '/connect',
          name: 'connect',
          component: () => import('@/views/ndrive/ConnetView.vue'),
        },
        {
          path: '/starred',
          name: 'starred',
          component: () => import('@/views/ndrive/Starredview.vue'),
        },
        {
          path: '/shared',
          name: 'shared',
          component: () => import('@/views/ndrive/Sharedview.vue'),
        },
        {
          path: '/recent',
          name: 'recent',
          component: () => import('@/views/ndrive/Recentview.vue'),
        },
        {
          path: '/trash',
          name: 'trash',
          component: () => import('@/views/ndrive/Trashview.vue'),
        },

        {
          path: '/auth/callback',
          name: 'auth-callback',
          component: () => import('@/views/ndrive/Authcallback.vue'),
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          beforeEnter: [authGuard, permissionGuard('users.read')],
          meta: {
            requiresAuth: true,
            permission: 'users.read',
            title: 'Usuarios'
          }
        },
        {
          path: '/unauthorized',
          name: 'unauthorized',
          component: () => import('@/views/auth/UnauthorizedView.vue'),
          meta: { requiresAuth: false, title: 'Sin autorización' }
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/auth/NotFoundView.vue'),
          meta: { title: 'Página no encontrada' }
        }]
    }
  ],
})

// Update page title
router.afterEach((to) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | My App`
  }
})

export default router
