import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

export function usePermissions() {
  const authStore = useAuthStore()

  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return authStore.hasAnyPermission(permissions)
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return authStore.hasAllPermissions(permissions)
  }

  const canCreate = (module: string): boolean => {
    return authStore.canAccessModule(module, 'create')
  }

  const canRead = (module: string): boolean => {
    return authStore.canAccessModule(module, 'read')
  }

  const canUpdate = (module: string): boolean => {
    return authStore.canAccessModule(module, 'update')
  }

  const canDelete = (module: string): boolean => {
    return authStore.canAccessModule(module, 'delete')
  }

  const userPermissions = computed(() => authStore.userPermissions)
  const userRoles = computed(() => authStore.userRoles)

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userPermissions,
    userRoles
  }
}
