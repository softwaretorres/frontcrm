<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <h2 class="text-2xl font-bold text-gray-900">Archivos destacados</h2>
      <p class="text-sm text-gray-600 mt-1">Tus archivos marcados con estrella</p>
    </div>

    <!-- Contenido -->
    <div class="flex-1 overflow-auto p-6">
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg
            class="w-12 h-12 text-blue-600 animate-spin mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="mt-4 text-gray-600">Cargando archivos destacados...</p>
        </div>
      </div>

      <div v-else-if="files.length === 0" class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No hay archivos destacados</h3>
          <p class="mt-2 text-sm text-gray-500">
            Marca archivos con una estrella para acceder rápidamente a ellos
          </p>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        <FileCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          :is-selected="false"
          @dblclick="handleFileDoubleClick(file)"
          @toggle-star="handleToggleStar(file.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { driveApi } from '@/api/ndrive/ndrive.service'
import type { DriveFile } from '@/types'
import { isFolder } from '@/utils/fileHelpers'
import FileCard from '@/components/ndrive/Filecard.vue'

const files = ref<DriveFile[]>([])
const isLoading = ref(false)

onMounted(async () => {
  await loadStarredFiles()
})

async function loadStarredFiles() {
  isLoading.value = true
  try {
  //  const response = await driveApi.listStarredFiles()
   // files.value = response.files
  } catch (error) {
    console.error('Error loading starred files:', error)
  } finally {
    isLoading.value = false
  }
}

function handleFileDoubleClick(file: DriveFile) {
  if (!isFolder(file.mimeType)) {
    window.open(file.webViewLink, '_blank')
  }
}

async function handleToggleStar(fileId: string) {
  try {
   // await driveApi.unstarFile(fileId)
   // await loadStarredFiles()
  } catch (error) {
    console.error('Error toggling star:', error)
  }
}
</script>
