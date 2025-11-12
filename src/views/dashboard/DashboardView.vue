<template>
<div class="w-[80%] max-w-6xl mx-auto">

    <!-- Título -->
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Archivos</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">89</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Información del Usuario</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-medium text-gray-600">Nombre completo</p>
          <p class="text-base text-gray-900 mt-1">{{ authStore.user?.fullName }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600">Email</p>
          <p class="text-base text-gray-900 mt-1">{{ authStore.user?.email }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600">Roles</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <span
              v-for="role in authStore.userRoles"
              :key="role.id"
              class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
            >
              {{ role.displayName }}
            </span>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600">Permisos activos</p>
          <p class="text-base text-gray-900 mt-1">
            {{ authStore.userPermissions.length }} permisos
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
</script>
