<!-- src/components/ndrive/QRViewModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Código QR</h3>
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

      <div v-else class="space-y-4">
        <!-- Info del token -->
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Token:</span> {{ token?.token.substring(0, 20) }}...
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Expira: {{ formatDate(token?.expiresAt) }}
          </p>
        </div>

        <!-- QR Code -->
        <div class="text-center">
          <img :src="qrCode" alt="QR Code" class="mx-auto" />
          <p class="mt-2 text-sm text-gray-600">Escanea para compartir</p>
        </div>

        <!-- Link para copiar -->
        <div class="flex gap-2">
          <input
            ref="linkInput"
            :value="shareUrl"
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

        <!-- Botón de descarga QR -->
        <button
          @click="downloadQR"
          class="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar código QR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { ShareToken } from '@/api/ndrive/ndrive.service'

interface Props {
  show: boolean
  token: ShareToken | null
}

const props = defineProps<Props>()
defineEmits<{ close: [] }>()

const loading = ref(false)
const error = ref<string | null>(null)
const qrCode = ref<string>('')
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)

const shareUrl = computed(() => {
  if (!props.token) return ''
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
  return `${frontendUrl}/share/${props.token.token}`
})

watch(() => props.show, async (show) => {
  if (show && props.token) {
    await generateQR()
  } else {
    // Limpiar al cerrar
    qrCode.value = ''
    error.value = null
    copied.value = false
  }
})

async function generateQR() {
  if (!props.token) return

  try {
    loading.value = true
    error.value = null

    // Generar QR code del link compartido
    qrCode.value = await driveApi.generateQRCode(shareUrl.value)
  } catch (err) {
    error.value = 'Error al generar código QR'
    console.error(err)
  } finally {
    loading.value = false
  }
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

function downloadQR() {
  if (!qrCode.value) return

  const link = document.createElement('a')
  link.download = `qr-token-${props.token?.token.substring(0, 8)}.png`
  link.href = qrCode.value
  link.click()
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
