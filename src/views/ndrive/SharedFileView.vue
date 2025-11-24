<!-- src/views/ndrive/SharedFileView.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p class="mt-4 text-gray-600 text-lg">Cargando archivo...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ errorTitle }}</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="retry"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Visor de archivo -->
    <div v-else-if="fileInfo" class="h-screen flex flex-col">
      <!-- Header compacto y fijo -->
      <div class="bg-white shadow-md z-10">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <div class="flex items-center justify-between gap-4">
            <!-- Info del archivo -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h1 class="text-lg font-semibold text-gray-900 truncate">{{ fileInfo.name }}</h1>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(fileInfo.size) }} • {{ getFileType(fileInfo.mimeType) }}
                </p>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- Botón de abrir en nueva pestaña (solo para preview) -->
              <a
                v-if="canPreview"
                :href="viewUrl"
                target="_blank"
                class="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                title="Abrir en nueva pestaña"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="hidden md:inline">Abrir</span>
              </a>

              <!-- Botón de descarga -->
              <a
                :href="downloadUrl"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                download
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="hidden sm:inline">Descargar</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Visor de contenido - PANTALLA COMPLETA -->
      <div class="flex-1 overflow-hidden bg-gray-800">
        <!-- Preview de PDF - PANTALLA COMPLETA -->
        <iframe
          v-if="isPdf"
          :src="viewUrl"
          class="w-full h-full border-0"
          frameborder="0"
          title="Vista previa del PDF"
        ></iframe>

        <!-- Preview de Imagen - PANTALLA COMPLETA -->
        <div
          v-else-if="isImage"
          class="w-full h-full flex items-center justify-center p-4 overflow-auto"
        >
          <img
            :src="viewUrl"
            :alt="fileInfo.name"
            class="max-w-full max-h-full object-contain"
            @error="handleImageError"
          />
        </div>

        <!-- Preview de Video -->
        <div
          v-else-if="isVideo"
          class="w-full h-full flex items-center justify-center bg-black"
        >
          <video
            :src="viewUrl"
            controls
            class="max-w-full max-h-full"
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        <!-- Otros archivos - Sin preview -->
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
            <svg class="w-32 h-32 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Vista previa no disponible</h3>
            <p class="text-gray-600 mb-6">Este tipo de archivo no se puede visualizar en el navegador</p>
            <a
              :href="downloadUrl"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              download
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar para ver
            </a>
          </div>
        </div>
      </div>

      <!-- Footer compacto (opcional) -->
      <div class="bg-white border-t py-2 px-4 text-center">
        <p class="text-xs text-gray-500">
          <svg class="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Archivo compartido de forma segura
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const errorTitle = ref('Error')
const fileInfo = ref<{ name: string; mimeType: string; size: string } | null>(null)

const token = computed(() => route.params.fileId as string)
console.log(route.params)

const baseUrl = import.meta.env.VITE_API_BASE_URL_DOMAIN || 'http://localhost:3000'
const downloadUrl = computed(() => `${baseUrl}/api/v1/public/download/${token.value}`)
const viewUrl = computed(() => `${baseUrl}/api/v1/public/view/${token.value}`)

const isImage = computed(() => {
  if (!fileInfo.value) return false
  return fileInfo.value.mimeType?.startsWith('image/')
})

const isPdf = computed(() => {
  if (!fileInfo.value) return false
  return fileInfo.value.mimeType === 'application/pdf'
})

const isVideo = computed(() => {
  if (!fileInfo.value) return false
  return fileInfo.value.mimeType?.startsWith('video/')
})

const canPreview = computed(() => isImage.value || isPdf.value || isVideo.value)

async function loadFile() {
  if (!token.value) {
    error.value = 'No se proporcionó un token válido'
    errorTitle.value = 'Link inválido'
    loading.value = false
    return
  }

  try {
    const response = await fetch(viewUrl.value, {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status === 404) {
        errorTitle.value = 'Archivo no encontrado'
        error.value = 'Este link no existe o ya no está disponible'
      } else if (response.status === 410) {
        errorTitle.value = 'Link expirado'
        error.value = 'Este link ha expirado y ya no está disponible'
      } else {
        errorTitle.value = 'Error al cargar'
        error.value = 'No se pudo cargar el archivo. Por favor, intenta nuevamente.'
      }
      loading.value = false
      return
    }

    // Extraer metadata de los headers
    const contentDisposition = response.headers.get('content-disposition')
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length') || '0'

    // Extraer nombre del archivo
    let fileName = 'archivo-compartido'
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '')
      }
    }

    fileInfo.value = {
      name: decodeURIComponent(fileName),
      mimeType: contentType,
      size: contentLength
    }

    loading.value = false
  } catch (err: any) {
    console.error('Error loading file:', err)
    loading.value = false
    errorTitle.value = 'Error de conexión'
    error.value = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
  }
}

onMounted(() => {
  loadFile()
})

function retry() {
  loading.value = true
  error.value = null
  loadFile()
}

function handleImageError() {
  console.error('Error loading image preview')
  error.value = 'No se pudo cargar la imagen'
  errorTitle.value = 'Error de carga'
}

function formatFileSize(bytes: string | number): string {
  const size = typeof bytes === 'string' ? parseInt(bytes) : bytes
  if (!size || isNaN(size)) return 'Tamaño desconocido'

  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let fileSize = size

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`
}

function getFileType(mimeType: string): string {
  const types: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'image/jpeg': 'Imagen JPEG',
    'image/png': 'Imagen PNG',
    'image/gif': 'Imagen GIF',
    'image/webp': 'Imagen WebP',
    'image/svg+xml': 'Imagen SVG',
    'video/mp4': 'Video MP4',
    'video/webm': 'Video WebM',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
    'text/plain': 'Texto',
    'application/zip': 'ZIP',
    'application/x-rar-compressed': 'RAR',
  }

  return types[mimeType] || 'Archivo'
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

/* Asegurar que el iframe del PDF ocupe todo el espacio */
iframe {
  display: block;
}
</style>
