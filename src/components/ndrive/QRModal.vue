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

      <div v-else class="space-y-4">
        <div class="text-center">
          <img :src="qrCode" alt="QR Code" class="mx-auto" />
          <p class="mt-2 text-sm text-gray-600">Escanea con tu móvil</p>
        </div>

        <div class="flex gap-2">
          <input
            ref="linkInput"
            v-model="shareLink"
            readonly
            class="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
            @click="selectLink"
          />
          <button
            @click="copyLink"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ copied ? '✓' : 'Copiar' }}
          </button>
        </div>

        <button
          @click="downloadQR"
          class="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Descargar QR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { DriveFile } from '@/types/drive'

interface Props {
  show: boolean
  file: DriveFile | null
}

const props = defineProps<Props>()
defineEmits<{ close: [] }>()

const loading = ref(false)
const error = ref<string | null>(null)
const qrCode = ref<string>('')
const shareLink = ref<string>('')
const copied = ref(false)
const linkInput = ref<HTMLInputElement | null>(null)

watch(() => props.show, async (show) => {
  if (show && props.file) {
    await generateQR()
  }
})

async function generateQR() {
  try {
    loading.value = true
    error.value = null

    shareLink.value = await driveApi.createShareLink(props.file!.id)
    qrCode.value = await driveApi.generateQRCode(shareLink.value)
  } catch (err) {
    error.value = 'Error al generar QR'
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
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

function downloadQR() {
  const link = document.createElement('a')
  link.download = `qr-${props.file?.name}.png`
  link.href = qrCode.value
  link.click()
}
</script>
