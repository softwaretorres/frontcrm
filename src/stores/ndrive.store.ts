import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DriveFile, DriveFolder, UploadProgress } from '@/types/drive'
import { driveApi } from '@/api/ndrive/ndrive.service'
import { useRouter } from 'vue-router'

export const useDriveStore = defineStore('drive', () => {
  // Estado
  const files = ref<DriveFile[]>([])
  const currentFolder = ref<DriveFolder | null>(null)
  const selectedFiles = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const uploadQueue = ref<Map<string, UploadProgress>>(new Map())
  const nextPageToken = ref<string | undefined>()
  const breadcrumbs = ref<Array<{ id: string; name: string }>>([
    { id: 'root', name: 'Mi unidad' },
  ])
  const viewMode = ref<'grid' | 'list'>('grid')
  const sortBy = ref<'name' | 'modifiedTime' | 'size'>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  // Computed
  const sortedFiles = computed(() => {
    const sorted = [...files.value]

    sorted.sort((a, b) => {
      // Las carpetas siempre van primero
      if (a.mimeType.includes('folder') && !b.mimeType.includes('folder')) return -1
      if (!a.mimeType.includes('folder') && b.mimeType.includes('folder')) return 1

      let comparison = 0
      switch (sortBy.value) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'modifiedTime':
          comparison = new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return sorted
  })

  const router = useRouter()



  const selectedFilesArray = computed(() => {
    return files.value.filter((f) => selectedFiles.value.has(f.id))
  })

  const hasSelection = computed(() => selectedFiles.value.size > 0)

  const activeUploads = computed(() => {
    return Array.from(uploadQueue.value.values()).filter((u) => u.status === 'uploading')
  })

  // Acciones

  async function loadFiles(folderId?: string) {
    isLoading.value = true
    try {
      const response = await driveApi.listFiles(folderId)
      console.log(response.files)
      files.value = response.files
      nextPageToken.value = response.nextPageToken
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
       const validate: boolean = error?.response.data.needsConnection
      if (validate) {
        router.push('/connect')
      }
      console.error('Error loading files:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadMoreFiles() {
    if (!nextPageToken.value || isLoading.value) return

    isLoading.value = true
    try {
      const response = await driveApi.listFiles(
        currentFolder.value?.id,
        nextPageToken.value
      )
      files.value.push(...response.files)
      nextPageToken.value = response.nextPageToken
    } catch (error) {
      console.error('Error loading more files:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function navigateToFolder(folder: DriveFolder) {
    currentFolder.value = folder
    await loadFiles(folder.id)

    // Actualizar breadcrumbs
    const index = breadcrumbs.value.findIndex((b) => b.id === folder.id)
    if (index >= 0) {
      breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    } else {
      breadcrumbs.value.push({ id: folder.id, name: folder.name })
    }
  }

  async function navigateToBreadcrumb(index: number) {
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    const target = breadcrumbs.value[index]

    if (target?.id === 'root') {
      currentFolder.value = null
      await loadFiles()
    } else {
      const folder = files.value.find((f) => f.id === target?.id) as DriveFolder
      if (folder) {
        currentFolder.value = folder
        await loadFiles(folder.id)
      }
    }
  }

  async function uploadFile(file: File, parentId?: string) {
    console.warn('Upload no implementado en el backend aún')
    alert('La funcionalidad de subir archivos aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')

    /* TODO: Descomentar cuando se implemente en el backend
    const uploadId = `${Date.now()}-${file.name}`

    uploadQueue.value.set(uploadId, {
      fileId: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    })

    try {
      const uploadedFile = await driveApi.uploadFile(
        file,
        parentId || currentFolder.value?.id,
        (progress) => {
          const upload = uploadQueue.value.get(uploadId)
          if (upload) {
            upload.progress = progress
            uploadQueue.value.set(uploadId, { ...upload })
          }
        }
      )

      uploadQueue.value.set(uploadId, {
        fileId: uploadId,
        fileName: file.name,
        progress: 100,
        status: 'completed',
      })

      // Agregar archivo a la lista
      files.value.unshift(uploadedFile)

      // Limpiar después de 3 segundos
      setTimeout(() => {
        uploadQueue.value.delete(uploadId)
      }, 3000)

      return uploadedFile
    } catch (error) {
      uploadQueue.value.set(uploadId, {
        fileId: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      })
      throw error
    }
    */
  }

  async function createFolder(name: string, parentId?: string) {
    console.warn('Create folder no implementado en el backend aún')
    alert('La funcionalidad de crear carpetas aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')
  }

  async function deleteFile(fileId: string) {
    console.warn('Delete no implementado en el backend aún')
    alert('La funcionalidad de eliminar aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')
  }

  async function deleteSelectedFiles() {
    console.warn('Delete selected no implementado en el backend aún')
    alert('La funcionalidad de eliminar aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')
  }

  async function renameFile(fileId: string, newName: string) {
    console.warn('Rename no implementado en el backend aún')
    alert('La funcionalidad de renombrar aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')
  }

  async function toggleStar(fileId: string) {
    console.warn('Star/Unstar no implementado en el backend aún')
    alert('La funcionalidad de destacar aún no está implementada en el backend')
    throw new Error('Funcionalidad no disponible aún')
  }

  async function downloadFile(file: DriveFile) {
    // Abrir en nueva pestaña usando webViewLink de Google Drive
    if (file.webViewLink) {
      window.open(file.webViewLink, '_blank')
    } else {
      alert('Este archivo no tiene un enlace de visualización disponible')
    }
  }

  function selectFile(fileId: string) {
    selectedFiles.value.add(fileId)
  }

  function deselectFile(fileId: string) {
    selectedFiles.value.delete(fileId)
  }

  function toggleSelectFile(fileId: string) {
    if (selectedFiles.value.has(fileId)) {
      selectedFiles.value.delete(fileId)
    } else {
      selectedFiles.value.add(fileId)
    }
  }

  function selectAll() {
    files.value.forEach((f) => selectedFiles.value.add(f.id))
  }

  function clearSelection() {
    selectedFiles.value.clear()
  }

  function setSortBy(field: 'name' | 'modifiedTime' | 'size') {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode
  }

  return {
    // Estado
    files: sortedFiles,
    currentFolder,
    selectedFiles,
    selectedFilesArray,
    hasSelection,
    isLoading,
    uploadQueue,
    activeUploads,
    nextPageToken,
    breadcrumbs,
    viewMode,
    sortBy,
    sortOrder,

    // Acciones
    loadFiles,
    loadMoreFiles,
    navigateToFolder,
    navigateToBreadcrumb,
    uploadFile,
    createFolder,
    deleteFile,
    deleteSelectedFiles,
    renameFile,
    toggleStar,
    downloadFile,
    selectFile,
    deselectFile,
    toggleSelectFile,
    selectAll,
    clearSelection,
    setSortBy,
    setViewMode,
  }
})
