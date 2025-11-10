<!-- Estas son vistas básicas que puedes expandir según necesites -->

<!-- SharedView.vue -->
<template>
  <div class="h-full flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
      <h2 class="mt-4 text-xl font-bold text-gray-900">Compartido conmigo</h2>
      <p class="mt-2 text-gray-600">Archivos que otros han compartido contigo</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Implementar lógica similar a StarredView usando driveApi.listSharedFiles()
</script>
