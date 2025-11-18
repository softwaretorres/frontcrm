<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando archivo...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="text-red-600 text-6xl mb-4">❌</div>
        <p class="text-gray-700 text-xl">{{ error }}</p>
      </div>
    </div>

    <div v-else class="h-screen flex flex-col">
      <!-- Header con info del archivo -->
      <div class="bg-white shadow px-6 py-4">
        <h1 class="text-xl font-semibold text-gray-800">{{ metadata?.name }}</h1>
        <p class="text-sm text-gray-500">{{ formatFileSize(metadata?.size) }}</p>
      </div>

      <!-- Visor de PDF -->
      <div class="flex-1">
        <iframe
          :src="fileUrl"
          class="w-full h-full border-0"
          type="application/pdf"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'


const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const metadata = ref<any>(null)

const fileId = computed(() => route.params.fileId as string)
const fileUrl = computed(() => `${import.meta.env.VITE_API_BASE_URL_DOMAIN}/drive/share/${fileId.value}`)
console.log(import.meta.env)

onMounted(async () => {
  await loadFileMetadata()
})

async function loadFileMetadata() {
  try {
    loading.value = true

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL_DOMAIN}/share/${fileId.value}/metadata`
    )
    metadata.value = response.data

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Archivo no encontrado'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
