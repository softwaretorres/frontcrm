<!-- src/components/ndrive/StatsModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Estadísticas del Link</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-semibold">{{ error }}</p>
      </div>

      <div v-else-if="stats" class="space-y-6">
        <!-- Información del archivo -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div class="flex items-start gap-4">
            <div class="bg-blue-500 p-3 rounded-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 text-lg">{{ stats.fileName }}</h4>
              <p class="text-sm text-gray-600 mt-1">Token: {{ token?.token.substring(0, 30) }}...</p>
            </div>
          </div>
        </div>

        <!-- Métricas principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Total de descargas -->
          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Descargas</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.downloadCount }}</p>
              </div>
              <div class="bg-green-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Estado -->
          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Estado</p>
                <p class="text-lg font-semibold">
                  <span
                    class="px-3 py-1 rounded-full text-sm"
                    :class="getStatusBadgeClass()"
                  >
                    {{ getStatusText() }}
                  </span>
                </p>
              </div>
              <div class="p-3 rounded-lg" :class="getStatusIconBg()">
                <svg class="w-8 h-8" :class="getStatusIconColor()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="stats.isActive && !stats.isExpired" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Días restantes -->
          <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Tiempo restante</p>
                <p class="text-2xl font-bold text-gray-900">{{ getTimeRemaining() }}</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalles de fechas -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
          <h5 class="font-semibold text-gray-900 mb-3">Detalles</h5>

          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <div>
              <p class="text-sm text-gray-600">Creado</p>
              <p class="font-medium text-gray-900">{{ formatDateLong(stats.createdAt) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p class="text-sm text-gray-600">Expira</p>
              <p class="font-medium" :class="stats.isExpired ? 'text-red-600' : 'text-gray-900'">
                {{ formatDateLong(stats.expiresAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <div class="flex-1">
              <p class="text-sm text-gray-600">Link de compartición</p>
              <div class="flex items-center gap-2 mt-1">
                <input
                  ref="linkInput"
                  :value="shareUrl"
                  readonly
                  class="flex-1 text-sm bg-white border rounded px-2 py-1 text-gray-700"
                  @click="selectLink"
                />
                <button
                  @click="copyLink"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  :class="{ 'bg-green-600 hover:bg-green-700': copied }"
                >
                  {{ copied ? '✓' : 'Copiar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            @click="refreshStats"
            class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>

          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { ShareToken, ShareTokenStats } from '@/api/ndrive/ndrive.service'

interface Props {
  show?: boolean
  token: ShareToken | null
}

const props = withDefaults(defineProps<Props>(), {
  show: true
})

defineEmits<{ close: [] }>()

const loading = ref(false)
const error = ref<string | null>(null)
const stats = ref<ShareTokenStats | null>(null)
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)

const shareUrl = computed(() => {
  if (!props.token) return ''
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
  return `${frontendUrl}/share/${props.token.token}`
})

watch(() => props.show, async (show) => {
  if (show && props.token) {
    await loadStats()
  } else {
    // Limpiar al cerrar
    stats.value = null
    error.value = null
  }
})

onMounted(async () => {
  if (props.show && props.token) {
    await loadStats()
  }
})

async function loadStats() {
  if (!props.token) return

  try {
    loading.value = true
    error.value = null
    stats.value = await driveApi.getShareTokenStats(props.token.token)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar estadísticas'
    console.error('Error loading stats:', err)
  } finally {
    loading.value = false
  }
}

async function refreshStats() {
  await loadStats()
}

function getStatusText(): string {
  if (!stats.value) return ''
  if (!stats.value.isActive) return 'Revocado'
  if (stats.value.isExpired) return 'Expirado'
  return 'Activo'
}

function getStatusBadgeClass(): string {
  if (!stats.value) return ''
  if (!stats.value.isActive) return 'bg-gray-100 text-gray-800'
  if (stats.value.isExpired) return 'bg-red-100 text-red-800'
  return 'bg-green-100 text-green-800'
}

function getStatusIconBg(): string {
  if (!stats.value) return 'bg-gray-100'
  if (!stats.value.isActive) return 'bg-gray-100'
  if (stats.value.isExpired) return 'bg-red-100'
  return 'bg-green-100'
}

function getStatusIconColor(): string {
  if (!stats.value) return 'text-gray-600'
  if (!stats.value.isActive) return 'text-gray-600'
  if (stats.value.isExpired) return 'text-red-600'
  return 'text-green-600'
}

function getTimeRemaining(): string {
  if (!stats.value) return ''
  if (stats.value.isExpired) return 'Expirado'
  if (!stats.value.isActive) return 'N/A'

  const now = new Date()
  const expiry = new Date(stats.value.expiresAt)
  const diff = expiry.getTime() - now.getTime()

  if (diff < 0) return 'Expirado'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days > 30) {
    const months = Math.floor(days / 30)
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  }
  if (days > 0) {
    return `${days} ${days === 1 ? 'día' : 'días'}`
  }
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
}

function formatDateLong(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function selectLink() {
  linkInput.value?.select()
}

async function copyLink() {
  try {
    await driveApi.copyToClipboard(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
    // Fallback
    linkInput.value?.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
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
</style>
