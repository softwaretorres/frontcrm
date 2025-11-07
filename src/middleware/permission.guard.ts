import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function permissionGuard(requiredPermission: string | string[]) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    const hasPermission = Array.isArray(requiredPermission)
      ? authStore.hasAnyPermission(requiredPermission)
      : authStore.hasPermission(requiredPermission)

    if (hasPermission) {
      next()
    } else {
      next({ name: 'unauthorized' })
    }
  }
}
