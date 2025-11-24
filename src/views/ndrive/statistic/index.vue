<!-- src/views/ndrive/SharedLinksView.vue -->
<template>
  <div class="container-fluid p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Links compartidos</h1>
        <p class="text-gray-600 mt-1">Gestiona todos tus archivos compartidos y sus estadísticas</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando links...</p>
      </div>

      <!-- Lista vacía -->
      <div v-else-if="!shareTokens || shareTokens.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tienes links compartidos</h3>
        <p class="text-gray-600">Comparte archivos desde tu Drive para verlos aquí</p>
      </div>

      <!-- Tabla de links -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archivo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descargas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="token in shareTokens" :key="token.id" class="hover:bg-gray-50">
                <!-- Archivo -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ getFileName(token) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ token.fileId.substring(0, 12) }}...
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Descargas -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span class="text-sm font-semibold text-gray-900">{{ token.downloadCount }}</span>
                  </div>
                </td>

                <!-- Creado -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(token.createdAt) }}
                </td>

                <!-- Expira -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm" :class="isExpired(token) ? 'text-red-600' : 'text-gray-900'">
                    {{ formatDate(token.expiresAt) }}
                  </div>
                  <div v-if="!isExpired(token)" class="text-xs text-gray-500">
                    {{ getTimeRemaining(token.expiresAt) }}
                  </div>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(token)"
                  >
                    {{ getStatusText(token) }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <!-- Ver estadísticas detalladas -->
                    <button
                      @click="viewDetailedStats(token)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Ver estadísticas"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>

                    <!-- Copiar link -->
                    <button
                      @click="copyLink(token)"
                      class="text-gray-600 hover:text-gray-900"
                      title="Copiar link"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>

                    <!-- Ver QR -->
                    <button
                      @click="showQR(token)"
                      class="text-green-600 hover:text-green-900"
                      title="Ver código QR"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </button>

                    <!-- Revocar -->
                    <button
                      v-if="token.isActive"
                      @click="confirmRevoke(token)"
                      class="text-red-600 hover:text-red-900"
                      title="Revocar acceso"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de estadísticas detalladas -->
    <StatsModal
      v-if="showStatsModal"
      :token="selectedToken"
      @close="closeStatsModal"
    />

    <!-- Modal QR -->
    <QRViewModal
      v-if="showQRModal"
      :token="selectedToken"
      @close="closeQRModal"
    />

    <!-- Toast de confirmación -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { ShareToken } from '@/api/ndrive/ndrive.service'
import StatsModal from '@/components/ndrive/StatsModal.vue'
import QRViewModal from '@/components/ndrive/QRViewModal.vue'

const loading = ref(false)
const shareTokens = ref<ShareToken[]>([])
const selectedToken = ref<ShareToken | null>(null)
const showStatsModal = ref(false)
const showQRModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

onMounted(async () => {
  await loadTokens()
})

async function loadTokens() {
  loading.value = true
  try {
    shareTokens.value = await driveApi.listShareTokens()
  } catch (error) {
    console.error('Error loading tokens:', error)
  } finally {
    loading.value = false
  }
}

function getFileName(token: ShareToken): string {
  // Aquí podrías hacer una llamada para obtener el nombre real del archivo
  // Por ahora mostramos un placeholder
  return `Archivo ${token.fileId.substring(0, 8)}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function isExpired(token: ShareToken): boolean {
  return new Date(token.expiresAt) < new Date()
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days > 30) {
    const months = Math.floor(days / 30)
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  }
  if (days > 0) {
    return `${days} ${days === 1 ? 'día' : 'días'}`
  }
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours} horas`
}

function getStatusClass(token: ShareToken): string {
  if (!token.isActive) return 'bg-gray-100 text-gray-800'
  if (isExpired(token)) return 'bg-red-100 text-red-800'
  return 'bg-green-100 text-green-800'
}

function getStatusText(token: ShareToken): string {
  if (!token.isActive) return 'Revocado'
  if (isExpired(token)) return 'Expirado'
  return 'Activo'
}

function viewDetailedStats(token: ShareToken) {
  selectedToken.value = token
  showStatsModal.value = true
}

function closeStatsModal() {
  showStatsModal.value = false
  selectedToken.value = null
}

async function copyLink(token: ShareToken) {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
  const link = `${frontendUrl}/share/${token.token}`

  try {
    await driveApi.copyToClipboard(link)
    toast('Link copiado al portapapeles')
  } catch (error) {
    console.error('Error copying link:', error)
  }
}

function showQR(token: ShareToken) {
  selectedToken.value = token
  showQRModal.value = true
}

function closeQRModal() {
  showQRModal.value = false
  selectedToken.value = null
}

async function confirmRevoke(token: ShareToken) {
  if (confirm('¿Estás seguro de que deseas revocar este link? Ya no podrá ser usado.')) {
    await revokeToken(token)
  }
}

async function revokeToken(token: ShareToken) {
  try {
    await driveApi.revokeShareToken(token.token)
    toast('Link revocado exitosamente')
    await loadTokens()
  } catch (error) {
    console.error('Error revoking token:', error)
    alert('Error al revocar el link')
  }
}

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
