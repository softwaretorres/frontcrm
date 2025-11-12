<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
      <main class="h-screen flex flex-col bg-gray-50">
        <router-view />
      </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
// import Sidebar from '@/components/layout/Sidebar.vue'
</script>
