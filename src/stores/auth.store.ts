import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/auth/auth.service'
import { STORAGE_KEYS } from '@/config/api.config'
import type { User, LoginCredentials, Permission } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const userPermissions = computed(() => {
    if (!user.value) return []
    return user.value.permissions
  })

  const userRoles = computed(() => {
    if (!user.value) return []
    return user.value.roles
  })

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true
      error.value = null

      const response = await authService.login(credentials)

      const { user: userData, tokens } = response.data

      // Guardar en state
      user.value = userData
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken

      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      // Limpiar state
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      error.value = null

      // Limpiar localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  function hasPermission(permissionName: string): boolean {
    if (!user.value) return false
    return user.value.permissions.some((p: Permission) => p.name === permissionName)
  }

  function hasAnyPermission(permissionNames: string[]): boolean {
    if (!user.value) return false
    return permissionNames.some(permissionName => hasPermission(permissionName))
  }

  function hasAllPermissions(permissionNames: string[]): boolean {
    if (!user.value) return false
    return permissionNames.every(permissionName => hasPermission(permissionName))
  }

  function hasRole(roleName: string): boolean {
    if (!user.value) return false
    return user.value.roles.some(r => r.name === roleName)
  }

  function canAccessModule(moduleName: string, action: string = 'read'): boolean {
    const permissionName = `${moduleName}.${action}`
    return hasPermission(permissionName)
  }

  function initializeAuth() {
    // Restaurar desde localStorage
    const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const savedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (savedToken && savedRefreshToken && savedUser) {
      accessToken.value = savedToken
      refreshToken.value = savedRefreshToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    loading,
    error,

    // Getters
    isAuthenticated,
    userPermissions,
    userRoles,

    // Actions
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    canAccessModule,
    initializeAuth
  }
})
