<template>
  <Transition name="slide-up">
    <div
      v-if="uploads.length > 0"
      class="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <svg
            class="w-5 h-5 text-blue-600"
            :class="{ 'animate-spin': hasActiveUploads }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span class="text-sm font-medium text-gray-900">
            Subiendo {{ activeUploadsCount }} de {{ uploads.length }} archivo{{ uploads.length > 1 ? 's' : '' }}
          </span>
        </div>

        <button
          class="p-1 hover:bg-gray-200 rounded transition-colors"
          @click="$emit('close')"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Lista de uploads -->
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="upload in uploads"
          :key="upload.fileId"
          class="px-4 py-3 border-b border-gray-100 last:border-b-0"
        >
          <div class="flex items-start gap-3">
            <!-- Icono de estado -->
            <div class="flex-shrink-0 mt-1">
              <svg
                v-if="upload.status === 'uploading'"
                class="w-5 h-5 text-blue-600 animate-spin"
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

              <svg
                v-else-if="upload.status === 'completed'"
                class="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>

              <svg
                v-else-if="upload.status === 'error'"
                class="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Información del archivo -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate" :title="upload.fileName">
                {{ upload.fileName }}
              </p>

              <!-- Barra de progreso -->
              <div v-if="upload.status === 'uploading'" class="mt-2">
                <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{{ upload.progress }}%</span>
                </div>
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-600 transition-all duration-300 ease-out"
                    :style="{ width: `${upload.progress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Mensaje de estado -->
              <p
                v-else-if="upload.status === 'completed'"
                class="text-xs text-green-600 mt-1"
              >
                Subida completada
              </p>

              <p
                v-else-if="upload.status === 'error'"
                class="text-xs text-red-600 mt-1"
              >
                {{ upload.error || 'Error al subir el archivo' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con resumen -->
      <div
        v-if="hasActiveUploads"
        class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600"
      >
        <div class="flex items-center justify-between">
          <span>Progreso total</span>
          <span class="font-medium">{{ overallProgress }}%</span>
        </div>
        <div class="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-600 transition-all duration-300"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UploadProgress } from '@/types'

interface Props {
  uploads: UploadProgress[]
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const activeUploadsCount = computed(() => {
  return props.uploads.filter((u) => u.status === 'uploading').length
})

const hasActiveUploads = computed(() => activeUploadsCount.value > 0)

const overallProgress = computed(() => {
  if (props.uploads.length === 0) return 0

  const total = props.uploads.reduce((sum, upload) => sum + upload.progress, 0)
  return Math.round(total / props.uploads.length)
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
