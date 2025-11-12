<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- LOGO / COMPANY -->
        <div class="flex items-center space-x-2">
          <!-- <img src="/logo.svg" alt="Logo" class="h-8 w-8" /> -->
          <h1 class="text-xl font-semibold text-gray-900 tracking-tight">
            {{ nameCompany }}
          </h1>
        </div>

        <!-- DESKTOP NAVIGATION -->
        <div class="hidden md:flex items-center space-x-2">
          <router-link
            to="/dashboard"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </router-link>

          <router-link
            to="/drive"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            nDrive
          </router-link>
        </div>

        <!-- USER MENU -->
        <div class="hidden md:flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">
            {{ authStore.user?.fullName }}
          </span>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <!-- MOBILE MENU BUTTON -->
        <div class="md:hidden flex items-center">
          <button
            @click="isOpen = !isOpen"
            class="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              v-if="!isOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div v-if="isOpen" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-4 py-3 space-y-2">
        <router-link
          to="/dashboard"
          class="nav-link-mobile"
          active-class="nav-link-mobile-active"
          @click="isOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/drive"
          class="nav-link-mobile"
          active-class="nav-link-mobile-active"
          @click="isOpen = false"
        >
          nDrive
        </router-link>
        <hr class="border-gray-200" />
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-700">{{ authStore.user?.fullName }}</span>
          <button
            @click="handleLogout"
            class="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const nameCompany = 'Ndrive'

const isOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors;
}

.nav-link-active {
  @apply bg-primary-50 text-primary-700 font-semibold;
}

.nav-link-mobile {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100;
}

.nav-link-mobile-active {
  @apply bg-primary-50 text-primary-700 font-semibold;
}
</style>
