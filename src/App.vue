<script setup>
import { onMounted, useTemplateRef, provide } from 'vue'
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
    <Toaster />
  <nav class="flex justify-between items-center bg-gray-800 p-3 text-white">
    <RouterLink
      to="/home"
      class="text-lg font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors">
      Memory Game
    </RouterLink>
    <div class="flex space-x-4">
      <RouterLink
        to="/register"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Register</span>
      </RouterLink>
      <RouterLink
        to="/login"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Login</span>
      </RouterLink>
    </div>
  </nav>
  <RouterView></RouterView>
</template>