<template>
  <div
    class="group flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    :class="{ 'bg-blue-50': isSelected }"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <!-- Checkbox -->
    <input
      type="checkbox"
      :checked="isSelected"
      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      @click.stop="$emit('toggle-select')"
    />

    <!-- Icono/Thumbnail -->
    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center">
      <img
        v-if="file.thumbnailLink"
        :src="file.thumbnailLink"
        :alt="file.name"
        class="max-w-full max-h-full object-contain rounded"
      />
      <div
        v-else
        class="text-2xl"
        :class="getFileColor(file.mimeType)"
      >
        {{ getFileIcon(file.mimeType) }}
      </div>
    </div>

    <!-- Nombre -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate" :title="file.name">
        {{ file.name }}
      </p>
      <div class="flex items-center gap-2 mt-0.5">
        <span v-if="file.shared" class="text-gray-400" title="Compartido">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- Propietario -->
    <div class="hidden lg:flex items-center gap-2 w-40 flex-shrink-0">
      <img
        v-if="file.owners?.[0]?.photoLink"
        :src="file.owners[0].photoLink"
        :alt="file.owners[0].displayName"
        class="w-6 h-6 rounded-full"
      />
      <span class="text-sm text-gray-600 truncate">
        {{ file.owners?.[0]?.displayName || 'Yo' }}
      </span>
    </div>

    <!-- Última modificación -->
    <div class="hidden md:block w-32 flex-shrink-0">
      <span class="text-sm text-gray-500">
        {{ formatDate(file.modifiedTime) }}
      </span>
    </div>

    <!-- Tamaño -->
    <div class="hidden sm:block w-24 flex-shrink-0 text-right">
      <span class="text-sm text-gray-500">
        {{ isFolder(file.mimeType) ? '-' : formatFileSize(file.size) }}
      </span>
    </div>

    <!-- Estrella -->
    <button
      class="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
      :class="file.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      @click.stop="$emit('toggle-star')"
    >
      <svg
        class="w-5 h-5"
        :class="file.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>

    <!-- Botón de más opciones -->
    <button
      class="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
      @click.stop="$emit('contextmenu', $event)"
    >
      <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'
import { getFileIcon, getFileColor, formatFileSize, formatDate, isFolder } from '@/utils/fileHelpers'

interface Props {
  file: DriveFile
  isSelected: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
  (e: 'dblclick'): void
  (e: 'contextmenu', event: MouseEvent): void
  (e: 'toggle-select'): void
  (e: 'toggle-star'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}

function handleDoubleClick() {
  emit('dblclick')
}
</script>
