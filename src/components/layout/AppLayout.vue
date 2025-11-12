<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />

    <div class="flex flex-1">
      <Sidebar />

      <main class="flex-1 p-8">
        <!-- Aquí se renderizan las vistas hijas -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>
