<template>
  <!-- Toolbar -->
  <Toolbar
    :has-selection="store.hasSelection"
    :selected-count="store.selectedFiles.size"
    :total-count="store.files.length"
    :has-files="store.files.length > 0"
    :view-mode="store.viewMode"
    :sort-by="store.sortBy"
    @toggle-select-all="handleToggleSelectAll"
    @create-folder="showCreateFolderModal = true"
    @upload="handleUploadClick"
    @download-selected="handleDownloadSelected"
    @share-selected="handleShareSelected"
    @delete-selected="handleDeleteSelected"
    @search="handleSearch"
    @sort="handleSort"
    @view-mode="handleViewMode"
  />

  <!-- Breadcrumbs -->
  <Breadcrumbs
    :breadcrumbs="store.breadcrumbs"
    @navigate="handleBreadcrumbNavigate"
  />

  <!-- Contenido principal -->
  <div class="flex-1 overflow-auto">
    <!-- Loading -->
    <div v-if="store.isLoading && store.files.length === 0" class="flex items-center justify-center h-64">
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
        <p class="mt-4 text-gray-600">Cargando archivos...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="store.files.length === 0" class="flex items-center justify-center h-64">
      <div class="text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Esta carpeta está vacía</h3>
        <p class="mt-2 text-sm text-gray-500">Sube archivos o crea una nueva carpeta</p>
        <div class="mt-6 flex gap-3 justify-center">
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            @click="handleUploadClick"
          >
            Subir archivos
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="showCreateFolderModal = true"
          >
            Nueva carpeta
          </button>
        </div>
      </div>
    </div>

    <!-- Vista de cuadrícula -->
    <div
      v-else-if="store.viewMode === 'grid'"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4"
    >
      <FileCard
        v-for="file in store.files"
        :key="file.id"
        :file="file"
        :is-selected="store.selectedFiles.has(file.id)"
        @click="handleFileClick(file, $event)"
        @dblclick="handleFileDoubleClick(file)"
        @contextmenu="handleContextMenu(file, $event)"
        @toggle-select="store.toggleSelectFile(file.id)"
        @toggle-star="store.toggleStar(file.id)"
      />
    </div>

    <!-- Vista de lista -->
    <div v-else class="bg-white">
      <!-- Encabezados -->
      <div class="flex items-center gap-4 px-4 py-2 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
        <div class="w-4"></div>
        <div class="w-8"></div>
        <div class="flex-1">Nombre</div>
        <div class="hidden lg:block w-40">Propietario</div>
        <div class="hidden md:block w-32">Última modificación</div>
        <div class="hidden sm:block w-24 text-right">Tamaño</div>
        <div class="w-10"></div>
        <div class="w-10"></div>
      </div>

      <!-- Items -->
      <FileListItem
        v-for="file in store.files"
        :key="file.id"
        :file="file"
        :is-selected="store.selectedFiles.has(file.id)"
        @click="handleFileClick(file, $event)"
        @dblclick="handleFileDoubleClick(file)"
        @contextmenu="handleContextMenu(file, $event)"
        @toggle-select="store.toggleSelectFile(file.id)"
        @toggle-star="store.toggleStar(file.id)"
      />
    </div>

    <!-- Cargar más -->
    <div v-if="store.nextPageToken && !store.isLoading" class="p-4 text-center">
      <button
        class="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        @click="store.loadMoreFiles()"
      >
        Cargar más
      </button>
    </div>
  </div>

  <!-- Upload Progress -->
  <UploadProgress
    :uploads="Array.from(store.uploadQueue.values())"
    @close="() => {}"
  />

  <!-- Input oculto para subir archivos -->
  <input
    ref="fileInput"
    type="file"
    multiple
    class="hidden"
    @change="handleFileSelect"
  />

  <!-- Modal crear carpeta -->
  <Teleport to="body">
    <div
      v-if="showCreateFolderModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showCreateFolderModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nueva carpeta</h3>
        <input
          v-model="newFolderName"
          type="text"
          placeholder="Nombre de la carpeta"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleCreateFolder"
        />
        <div class="flex gap-3 mt-6 justify-end">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="showCreateFolderModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            :disabled="!newFolderName.trim()"
            @click="handleCreateFolder"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Context Menu -->
  <Teleport to="body">
    <div
      v-if="contextMenu.show"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      class="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-48"
      @click="contextMenu.show = false"
    >
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        @click="handleDownloadFile(contextMenu.file!)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Descargar
      </button>
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        @click="handleShowQR(contextMenu.file!)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Compartir con QR
      </button>
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        @click="handleCopyLink(contextMenu.file!)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copiar link
      </button>
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
        @click="handleRenameFile(contextMenu.file!)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Renombrar
      </button>
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-3"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Compartir
      </button>
      <hr class="my-1" />
      <button
        class="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-3"
        @click="handleDeleteFile(contextMenu.file!)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar
      </button>
    </div>
  </Teleport>

  <!-- QR Modal -->
  <QRModal
    :show="showQRModal"
    :file="selectedFileForQR"
    @close="showQRModal = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDriveStore } from '@/stores/ndrive.store'
import type { DriveFile, DriveFolder } from '@/types'
import { isFolder } from '@/utils/fileHelpers'
import Toolbar from '@/components/ndrive/Toolbar.vue'
import Breadcrumbs from '@/components/ndrive/Breadcrumbs.vue'
import FileCard from '@/components/ndrive/Filecard.vue'
import FileListItem from '@/components/ndrive/Filelistitem.vue'
import UploadProgress from '@/components/ndrive/Uploadprogress.vue'
import QRModal from '@/components/ndrive/QRModal.vue'

const store = useDriveStore()

const fileInput = ref<HTMLInputElement>()
const showCreateFolderModal = ref(false)
const newFolderName = ref('')
const showQRModal = ref(false)
const selectedFileForQR = ref<DriveFile | null>(null)
const contextMenu = ref<{
  show: boolean
  x: number
  y: number
  file: DriveFile | null
}>({
  show: false,
  x: 0,
  y: 0,
  file: null,
})

onMounted(async () => {
  await store.loadFiles()
})

function handleUploadClick() {
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  for (const file of files) {
    try {
      await store.uploadFile(file)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  if (target) target.value = ''
}

async function handleCreateFolder() {
  if (!newFolderName.value.trim()) return

  try {
    await store.createFolder(newFolderName.value.trim())
    newFolderName.value = ''
    showCreateFolderModal.value = false
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}

function handleFileClick(file: DriveFile, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey) {
    store.toggleSelectFile(file.id)
  } else if (event.shiftKey) {
    store.toggleSelectFile(file.id)
  } else {
    store.clearSelection()
    store.selectFile(file.id)
  }
}

async function handleFileDoubleClick(file: DriveFile) {
  if (isFolder(file.mimeType)) {
    await store.navigateToFolder(file as DriveFolder)
  } else {
    window.open(file.webViewLink, '_blank')
  }
}

function handleContextMenu(file: DriveFile, event: MouseEvent) {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    file,
  }
}

async function handleBreadcrumbNavigate(index: number) {
  await store.navigateToBreadcrumb(index)
}

function handleToggleSelectAll() {
  if (store.hasSelection && store.selectedFiles.size === store.files.length) {
    store.clearSelection()
  } else {
    store.selectAll()
  }
}

async function handleDownloadSelected() {
  for (const file of store.selectedFilesArray) {
    try {
      await store.downloadFile(file)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }
}

function handleShareSelected() {
  console.log('Share selected files')
}

async function handleDeleteSelected() {
  if (!confirm(`¿Eliminar ${store.selectedFiles.size} archivo(s)?`)) return

  try {
    await store.deleteSelectedFiles()
  } catch (error) {
    console.error('Error deleting files:', error)
  }
}

function handleSearch(query: string) {
  console.log('Search:', query)
}

function handleSort(field: string) {
  store.setSortBy(field as 'name' | 'modifiedTime' | 'size')
}

function handleViewMode(mode: 'grid' | 'list') {
  store.setViewMode(mode)
}

async function handleDownloadFile(file: DriveFile) {
  try {
    await store.downloadFile(file)
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

function handleShowQR(file: DriveFile) {
  selectedFileForQR.value = file
  showQRModal.value = true
  contextMenu.value.show = false
}

async function handleCopyLink(file: DriveFile) {
  try {
    if (file.webViewLink) {
      await navigator.clipboard.writeText(file.webViewLink)
    } else {
      const link = await store.getShareLink(file.id)
      await navigator.clipboard.writeText(link)
    }
    alert('Link copiado al clipboard')
  } catch (error) {
    console.error('Error copying link:', error)
    alert('Error al copiar el link')
  }
}

async function handleRenameFile(file: DriveFile) {
  const newName = prompt('Nuevo nombre:', file.name)
  if (!newName || newName === file.name) return

  try {
    await store.renameFile(file.id, newName)
  } catch (error) {
    console.error('Error renaming file:', error)
  }
}

async function handleDeleteFile(file: DriveFile) {
  if (!confirm(`¿Eliminar "${file.name}"?`)) return

  try {
    await store.deleteFile(file.id)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

document.addEventListener('click', () => {
  contextMenu.value.show = false
})
</script>
