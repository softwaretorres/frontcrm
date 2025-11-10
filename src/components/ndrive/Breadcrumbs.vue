<template>
  <nav class="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
    <button
      v-for="(crumb, index) in breadcrumbs"
      :key="crumb.id"
      class="flex items-center gap-2 group"
      @click="$emit('navigate', index)"
    >
      <!-- Icono de inicio para el primer elemento -->
      <svg
        v-if="index === 0"
        class="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
        />
      </svg>

      <!-- Nombre del breadcrumb -->
      <span
        class="text-sm font-medium transition-colors"
        :class="
          index === breadcrumbs.length - 1
            ? 'text-gray-900'
            : 'text-gray-600 group-hover:text-blue-600'
        "
      >
        {{ index === 0 ? '' : crumb.name }}
      </span>

      <!-- Separador -->
      <svg
        v-if="index < breadcrumbs.length - 1"
        class="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
interface Breadcrumb {
  id: string
  name: string
}

interface Props {
  breadcrumbs: Breadcrumb[]
}

interface Emits {
  (e: 'navigate', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
