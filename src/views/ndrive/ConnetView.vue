<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">nDrive</h1>
          <p class="text-gray-600 mt-2">Gestor de archivos de Google Drive</p>
        </div>

        <!-- Estado de conexión -->
        <div v-if="isLoading" class="text-center py-8">
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
          <p class="mt-4 text-gray-600">Verificando conexión...</p>
        </div>

        <!-- No conectado -->
        <div v-else-if="!isConnected && !error">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm text-blue-800">
                <p class="font-medium">Conecta tu cuenta de Google</p>
                <p class="mt-1">Necesitas autorizar el acceso a Google Drive para continuar.</p>
              </div>
            </div>
          </div>

          <!-- Opciones de conexión -->
          <div class="space-y-4">
            <!-- Conectar con OAuth -->
            <button
              @click="connectWithOAuth"
              :disabled="isConnecting"
              class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="font-medium text-gray-700">
                {{ isConnecting ? 'Conectando...' : 'Conectar con Google' }}
              </span>
            </button>

            <!-- Divisor -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <!-- Conectar con Access Token -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Access Token (opcional)
              </label>
              <input
                v-model="accessToken"
                type="password"
                placeholder="Pega tu access token aquí"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="connectWithToken"
                :disabled="!accessToken || isConnecting"
                class="w-full mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Conectar con Token
              </button>
            </div>
          </div>
        </div>

        <!-- Conectado exitosamente -->
        <div v-else-if="isConnected" class="text-center py-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">¡Conectado exitosamente!</h3>
          <p class="text-gray-600 mb-6">Ya puedes acceder a tus archivos de Google Drive</p>
          <button
            @click="goToDrive"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir a mis archivos
          </button>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error de conexión</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="retry"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600">
        <p>Al conectar, aceptas dar acceso a tus archivos de Google Drive</p>
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
const isConnected = ref(false)
const isConnecting = ref(false)
const error = ref<string | null>(null)
const accessToken = ref('')

onMounted(async () => {
  await checkStatus()
})

async function checkStatus() {
  isLoading.value = true
  error.value = null

  try {
    const status = await driveApi.getAuthStatus()
    isConnected.value = status.connected || status.authenticated

    if (isConnected.value) {
      // Esperar 1 segundo y redirigir
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  } catch (err) {
    console.error('Error checking status:', err)
    error.value = 'No se pudo verificar el estado de la conexión'
  } finally {
    isLoading.value = false
  }
}

async function connectWithOAuth() {
  isConnecting.value = true
  error.value = null

  try {
    // Esto redirigirá a Google OAuth
    await driveApi.connect()
  } catch (err) {
    console.error('Error connecting with OAuth:', err)
    error.value = 'Error al iniciar la conexión con Google'
    isConnecting.value = false
  }
}

async function connectWithToken() {
  if (!accessToken.value) return

  isConnecting.value = true
  error.value = null

  try {
    await driveApi.connect(accessToken.value)
    isConnected.value = true

    // Redirigir después de 1 segundo
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    console.error('Error connecting with token:', err)
    error.value = 'Token inválido o error al conectar'
  } finally {
    isConnecting.value = false
  }
}

function goToDrive() {
  router.push('/')
}

function retry() {
  error.value = null
  isConnected.value = false
  checkStatus()
}
</script>
