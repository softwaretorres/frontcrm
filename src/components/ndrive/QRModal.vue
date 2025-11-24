<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Compartir archivo</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Generando QR...</p>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <div v-else-if="shareData" class="space-y-4">
        <!-- Información del archivo -->
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="font-medium text-sm">{{ file?.name }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Expira: {{ formatDate(shareData.expiresAt) }}
          </p>
        </div>

        <!-- QR Code -->
        <div class="text-center">
          <img :src="qrCode" alt="QR Code" class="mx-auto" />
          <p class="mt-2 text-sm text-gray-600">Escanea con tu móvil para descargar</p>
        </div>

        <!-- Link para copiar -->
        <div class="flex gap-2">
          <input
            ref="linkInput"
            :value="shareData.shareUrl"
            readonly
            class="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
            @click="selectLink"
          />
          <button
            @click="copyLink"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :class="{ 'bg-green-600 hover:bg-green-700': copied }"
          >
            {{ copied ? '✓' : 'Copiar' }}
          </button>
        </div>

        <!-- Opciones de expiración (opcional) -->
        <div class="border-t pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Duración del link
          </label>
          <select
            v-model="expirationDays"
            @change="regenerateToken"
            class="w-full px-3 py-2 border rounded-lg bg-white text-sm"
          >
            <option :value="1">1 día</option>
            <option :value="7">1 semana</option>
            <option :value="30">1 mes</option>
            <option :value="90">3 meses</option>
            <option :value="180">6 meses</option>
            <option :value="365">1 año</option>
          </select>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-2">
          <button
            @click="downloadQR"
            class="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar QR
          </button>

          <button
            v-if="shareData.token"
            @click="viewStats"
            class="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Estadísticas
          </button>
        </div>

        <!-- Estadísticas (si se muestran) -->
        <div v-if="showStats && stats" class="bg-blue-50 p-3 rounded-lg text-sm">
          <p class="font-medium text-blue-900 mb-2">Estadísticas del link</p>
          <div class="space-y-1 text-blue-700">
            <p>• Descargas: {{ stats.downloadCount }}</p>
            <p>• Creado: {{ formatDate(stats.createdAt) }}</p>
            <p>• Estado: {{ stats.isActive ? 'Activo' : 'Inactivo' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { DriveFile } from '@/types/drive'
import type { ShareTokenResponse, ShareTokenStats } from '@/api/ndrive/ndrive.service'

interface Props {
  show: boolean
  file: DriveFile | null
}

const props = defineProps<Props>()
defineEmits<{ close: [] }>()

const loading = ref(false)
const error = ref<string | null>(null)
const qrCode = ref<string>('')
const shareData = ref<ShareTokenResponse | null>(null)
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)
const expirationDays = ref(365)
const showStats = ref(false)
const stats = ref<ShareTokenStats | null>(null)

watch(() => props.show, async (show) => {
  if (show && props.file) {
    // Reset estado
    showStats.value = false
    stats.value = null
    await generateShareToken()
  } else {
    // Limpiar al cerrar
    shareData.value = null
    qrCode.value = ''
    error.value = null
  }
})

async function generateShareToken() {
  try {
    loading.value = true
    error.value = null

    // Crear token de compartición usando driveApi directamente
    shareData.value = await driveApi.createShareToken(props.file!.id, expirationDays.value)

    // Generar QR code
    qrCode.value = await driveApi.generateQRCode(shareData.value.shareUrl)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al generar link de compartición'
    console.error('Error generando token:', err)
  } finally {
    loading.value = false
  }
}

async function regenerateToken() {
  await generateShareToken()
}

function selectLink() {
  linkInput.value?.select()
}

async function copyLink() {
  if (!shareData.value) return

  try {
    await driveApi.copyToClipboard(shareData.value.shareUrl)
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

function downloadQR() {
  if (!qrCode.value || !props.file) return

  const link = document.createElement('a')
  link.download = `qr-${props.file.name}.png`
  link.href = qrCode.value
  link.click()
}

async function viewStats() {
  if (!shareData.value?.token) return

  try {
    showStats.value = !showStats.value

    if (showStats.value && !stats.value) {
      stats.value = await driveApi.getShareTokenStats(shareData.value.token)
    }
  } catch (err) {
    console.error('Error obteniendo estadísticas:', err)
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Animación para el spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
