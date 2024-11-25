<script setup>
import { inject } from 'vue'
import TopList from '@/components/mainPage/TopList.vue'

</script>

<template>
  <div class="flex h-screen items-center justify-center px-10 -mt-10">
    <div class="flex justify-between items-start w-full max-w-screen-xl px-10">
      <div>
        <TopList />
      </div>
      <div class="flex flex-col space-y-5 w-1/3">
        <div class="bg-gray-800 text-white p-4 rounded hover:bg-gray-700 transition-all w-full">
          <RouterLink to="/singleplayer" class="block text-center text-lg">Single Player</RouterLink>
        </div>
        <div class="bg-gray-800 text-white p-4 rounded hover:bg-gray-700 transition-all w-full">
          <RouterLink to="/multiplayer" class="block text-center text-lg">Multiplayer</RouterLink>
        </div>
        <div class="bg-gray-800 text-white p-4 rounded hover:bg-gray-700 transition-all w-full">
          <RouterLink to="/statistics" class="block text-center text-lg">Statistics</RouterLink>
        </div>
        <div class="bg-gray-800 text-white p-4 rounded hover:bg-gray-700 transition-all w-full">
          <RouterLink to="/shop" class="block text-center text-lg">Shop</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>