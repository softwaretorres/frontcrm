<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3">
    <div class="flex items-center justify-between gap-4">
      <!-- Lado izquierdo: Acciones principales -->
      <div class="flex items-center gap-2">
        <!-- Checkbox seleccionar todo -->
        <input
          v-if="hasFiles"
          type="checkbox"
          :checked="hasSelection && selectedCount === totalCount"
          :indeterminate="hasSelection && selectedCount < totalCount"
          class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          @change="$emit('toggle-select-all')"
        />

        <!-- Botón Nueva carpeta -->
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="$emit('create-folder')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          Nueva carpeta
        </button>

        <!-- Botón Subir -->
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          @click="$emit('upload')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Subir
        </button>

        <!-- Separador -->
        <div v-if="hasSelection" class="h-8 w-px bg-gray-300 mx-2"></div>

        <!-- Acciones de selección -->
        <template v-if="hasSelection">
          <span class="text-sm text-gray-600">
            {{ selectedCount }} seleccionado{{ selectedCount > 1 ? 's' : '' }}
          </span>

          <button
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Descargar"
            @click="$emit('download-selected')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>

          <button
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Compartir"
            @click="$emit('share-selected')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          <button
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
            @click="$emit('delete-selected')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </template>
      </div>

      <!-- Lado derecho: Vista y ordenamiento -->
      <div class="flex items-center gap-2">
        <!-- Búsqueda -->
        <div class="relative hidden md:block">
          <input
            type="text"
            placeholder="Buscar archivos..."
            class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            @input="$emit('search', ($event.target as HTMLInputElement).value)"
          />
          <svg
            class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Ordenar -->
        <select
          :value="sortBy"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="$emit('sort', ($event.target as HTMLSelectElement).value)"
        >
          <option value="name">Nombre</option>
          <option value="modifiedTime">Fecha de modificación</option>
          <option value="size">Tamaño</option>
        </select>

        <!-- Cambiar vista -->
        <div class="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            class="p-2 transition-colors"
            :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
            title="Vista de cuadrícula"
            @click="$emit('view-mode', 'grid')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            class="p-2 transition-colors"
            :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
            title="Vista de lista"
            @click="$emit('view-mode', 'list')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasSelection: boolean
  selectedCount: number
  totalCount: number
  hasFiles: boolean
  viewMode: 'grid' | 'list'
  sortBy: string
}

interface Emits {
  (e: 'toggle-select-all'): void
  (e: 'create-folder'): void
  (e: 'upload'): void
  (e: 'download-selected'): void
  (e: 'share-selected'): void
  (e: 'delete-selected'): void
  (e: 'search', value: string): void
  (e: 'sort', value: string): void
  (e: 'view-mode', mode: 'grid' | 'list'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
