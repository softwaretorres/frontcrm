<template>
  <div class="h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="isLoading">
        <svg
          class="w-16 h-16 text-blue-600 animate-spin mx-auto"
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
        <p class="mt-4 text-lg text-gray-600">Autenticando con Google Drive...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <svg class="w-16 h-16 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <h2 class="mt-4 text-xl font-bold text-gray-900">Error de autenticación</h2>
        <p class="mt-2 text-gray-600">{{ error }}</p>
        <button
          class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          @click="retry"
        >
          Intentar nuevamente
        </button>
      </div>

      <div v-else class="max-w-md mx-auto">
        <svg class="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <h2 class="mt-4 text-xl font-bold text-gray-900">¡Autenticación exitosa!</h2>
        <p class="mt-2 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { driveApi } from '@/api/ndrive/ndrive.service'

const router = useRouter()
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (!code) {
    error.value = 'Código de autorización no encontrado'
    isLoading.value = false
    return
  }

  try {
    // Enviar el código al backend
    await driveApi.connect(code)

    // Redirigir después de 1 segundo
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    console.error('Error during auth callback:', err)
    error.value = 'Error al autenticar con Google Drive. Por favor, intenta nuevamente.'
    isLoading.value = false
  }
})

async function retry() {
  try {
    // Redirigir a la página de conexión
    window.location.href = '/connect'
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error al redirigir'
  }
}
</script>
