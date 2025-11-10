<template>
  <div
    class="group relative rounded-lg border bg-white p-4 transition-all hover:shadow-lg cursor-pointer"
    :class="{
      'ring-2 ring-blue-500': isSelected,
      'border-gray-200 hover:border-gray-300': !isSelected,
    }"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <!-- Checkbox de selección -->
    <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <input
        type="checkbox"
        :checked="isSelected"
        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        @click.stop="$emit('toggle-select')"
      />
    </div>

    <!-- Botón de estrella -->
    <button
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
      :class="{ 'opacity-100': file.starred }"
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

    <!-- Thumbnail o icono -->
    <div class="flex flex-col items-center">
      <div class="w-20 h-20 flex items-center justify-center mb-3">
        <img
          v-if="file.thumbnailLink"
          :src="file.thumbnailLink"
          :alt="file.name"
          class="max-w-full max-h-full object-contain rounded"
        />
        <div
          v-else
          class="text-5xl"
          :class="getFileColor(file.mimeType)"
        >
          {{ getFileIcon(file.mimeType) }}
        </div>
      </div>

      <!-- Nombre del archivo -->
      <div class="w-full text-center">
        <p
          class="text-sm font-medium text-gray-900 truncate"
          :title="file.name"
        >
          {{ file.name }}
        </p>
        <div class="flex items-center justify-center gap-2 mt-1 text-xs text-gray-500">
          <span v-if="!isFolder(file.mimeType)">
            {{ formatFileSize(file.size) }}
          </span>
          <span v-if="file.shared" title="Compartido">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Overlay para más acciones (visible en hover) -->
    <div
      class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { DriveFile } from '@/types'
import { getFileIcon, getFileColor, formatFileSize, isFolder } from '@/utils/fileHelpers'

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
