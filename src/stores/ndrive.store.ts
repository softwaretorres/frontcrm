import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ndriveService } from '@/api/ndrive/ndrive.service'
import type { NDriveFile, NDriveConnection } from '@/types'

export const useNDriveStore = defineStore('ndrive', () => {
  // State
  const connected = ref(false)
  const userEmail = ref<string | null>(null)
  const userName = ref<string | null>(null)
  const files = ref<NDriveFile[]>([])
  const currentFolderId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const breadcrumbs = ref<{ id: string | null; name: string }[]>([
    { id: null, name: 'Mi Drive' }
  ])

  // Getters
  const isConnected = computed(() => connected.value)
  const currentFiles = computed(() => files.value)
  const folders = computed(() => files.value.filter(f => f.isFolder))
  const documents = computed(() => files.value.filter(f => !f.isFolder))

  // Actions
  async function checkConnection() {
    try {
      loading.value = true
      const response = await ndriveService.getConnectionStatus()

      if (response.success && response.data.connected) {
        connected.value = true
        userEmail.value = response.data.email || null
        userName.value = response.data.name || null
      } else {
        connected.value = false
        userEmail.value = null
        userName.value = null
      }
    } catch (err: any) {
      connected.value = false
      error.value = err.response?.data?.message || 'Error al verificar conexión'
    } finally {
      loading.value = false
    }
  }

  async function connect() {
    try {
      loading.value = true
      error.value = null

      const response = await ndriveService.connect()

      if (response.success && response.data.authUrl) {
        // Abrir ventana de autenticación
        window.open(response.data.authUrl, '_blank', 'width=600,height=700')

        // Escuchar evento de conexión exitosa
        window.addEventListener('ndrive-connected', handleConnectionSuccess)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al conectar con nDrive'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function disconnect() {
    try {
      loading.value = true
      error.value = null

      await ndriveService.disconnect()

      connected.value = false
      userEmail.value = null
      userName.value = null
      files.value = []
      currentFolderId.value = null
      breadcrumbs.value = [{ id: null, name: 'Mi Drive' }]
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al desconectar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadFiles(folderId: string | null = null) {
    try {
      loading.value = true
      error.value = null

      const response = await ndriveService.listFiles(folderId || undefined)

      if (response.success) {
        files.value = response.data.files
        currentFolderId.value = folderId
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar archivos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function downloadFile(fileId: string, fileName: string) {
    try {
      loading.value = true
      error.value = null

      const blob = await ndriveService.downloadFile(fileId)

      // Crear link de descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()

      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al descargar archivo'
      throw err
    } finally {
      loading.value = false
    }
  }

  function navigateToFolder(folderId: string | null, folderName: string) {
    if (folderId === null) {
      // Volver a raíz
      breadcrumbs.value = [{ id: null, name: 'Mi Drive' }]
    } else {
      // Buscar si ya existe en breadcrumbs
      const existingIndex = breadcrumbs.value.findIndex(b => b.id === folderId)

      if (existingIndex >= 0) {
        // Si existe, cortar hasta ese punto
        breadcrumbs.value = breadcrumbs.value.slice(0, existingIndex + 1)
      } else {
        // Si no existe, agregar
        breadcrumbs.value.push({ id: folderId, name: folderName })
      }
    }

    loadFiles(folderId)
  }

  function handleConnectionSuccess() {
    connected.value = true
    checkConnection()
    window.removeEventListener('ndrive-connected', handleConnectionSuccess)
  }

  return {
    // State
    connected,
    userEmail,
    userName,
    files,
    currentFolderId,
    loading,
    error,
    breadcrumbs,

    // Getters
    isConnected,
    currentFiles,
    folders,
    documents,

    // Actions
    checkConnection,
    connect,
    disconnect,
    loadFiles,
    downloadFile,
    navigateToFolder
  }
})
