import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/middleware/auth.guard'
import { permissionGuard } from '@/middleware/permission.guard'

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
      path: '/ndrive',
      name: 'ndrive',
      component: () => import('@/views/ndrive/NDriveView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true, title: 'nDrive' }
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
