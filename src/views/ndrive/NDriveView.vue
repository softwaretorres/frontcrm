<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/dashboard" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <h1 class="text-xl font-bold text-gray-900">nDrive</h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ authStore.user?.fullName }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Connection Status -->
      <div v-if="!ndriveStore.isConnected" class="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <div class="max-w-md mx-auto">
          <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Conecta tu nDrive</h2>
          <p class="text-gray-600 mb-6">
            Conecta tu cuenta de nDrive para acceder a tus archivos y carpetas
          </p>
          <button
            @click="handleConnect"
            :disabled="ndriveStore.loading"
            class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!ndriveStore.loading">Conectar nDrive</span>
            <span v-else>Conectando...</span>
          </button>
          <p v-if="ndriveStore.error" class="mt-4 text-sm text-red-600">
            {{ ndriveStore.error }}
          </p>
        </div>
      </div>

      <!-- Connected State -->
      <div v-else>
        <!-- Header with user info -->
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-green-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Conectado a nDrive</h3>
                <p class="text-sm text-gray-600">{{ ndriveStore.userEmail }}</p>
              </div>
            </div>
            <button
              @click="handleDisconnect"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Desconectar
            </button>
          </div>
        </div>

        <!-- Breadcrumbs -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
          <nav class="flex items-center space-x-2 text-sm">
            <button
              v-for="(crumb, index) in ndriveStore.breadcrumbs"
              :key="index"
              @click="navigateTo(crumb.id, crumb.name)"
              class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              :class="{ 'font-medium text-gray-900': index === ndriveStore.breadcrumbs.length - 1 }"
            >
              <span>{{ crumb.name }}</span>
              <svg
                v-if="index < ndriveStore.breadcrumbs.length - 1"
                class="w-4 h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>

        <!-- Files Grid -->
        <div v-if="ndriveStore.loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600">Cargando archivos...</p>
          </div>
        </div>

        <div v-else-if="ndriveStore.currentFiles.length === 0" class="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Carpeta vacía</h3>
          <p class="text-gray-600">No hay archivos en esta ubicación</p>
        </div>

        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="divide-y divide-gray-200">
            <div
              v-for="file in ndriveStore.currentFiles"
              :key="file.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
              @click="handleFileClick(file)"
            >
              <div class="flex items-center space-x-4 flex-1">
                <div :class="[
                  'p-2 rounded-lg',
                  file.isFolder ? 'bg-yellow-100' : 'bg-blue-100'
                ]">
                  <svg v-if="file.isFolder" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(file.modifiedTime) }}
                    <span v-if="!file.isFolder"> · {{ formatSize(file.size) }}</span>
                  </p>
                </div>
              </div>
              <button
                v-if="!file.isFolder"
                @click.stop="handleDownload(file)"
                class="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNDriveStore } from '@/stores/ndrive.store'
import type { NDriveFile } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const ndriveStore = useNDriveStore()

onMounted(async () => {
  await ndriveStore.checkConnection()
  if (ndriveStore.isConnected) {
    await ndriveStore.loadFiles()
  }
})

const handleConnect = async () => {
  try {
    await ndriveStore.connect()
  } catch (error) {
    console.error('Error al conectar:', error)
  }
}

const handleDisconnect = async () => {
  if (confirm('¿Estás seguro de que deseas desconectar tu cuenta de nDrive?')) {
    try {
      await ndriveStore.disconnect()
    } catch (error) {
      console.error('Error al desconectar:', error)
    }
  }
}

const handleFileClick = (file: NDriveFile) => {
  if (file.isFolder) {
    navigateTo(file.id, file.name)
  }
}

const navigateTo = (folderId: string | null, folderName: string) => {
  ndriveStore.navigateToFolder(folderId, folderName)
}

const handleDownload = async (file: NDriveFile) => {
  try {
    await ndriveStore.downloadFile(file.id, file.name)
  } catch (error) {
    console.error('Error al descargar:', error)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
