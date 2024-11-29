<script setup>
import { inject, onMounted } from 'vue';
import TopList from '@/components/mainPage/TopList.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const storeAuth = useAuthStore();

</script>


<template>
  <div class="flex items-center justify-center mt-1">
    <div class="w-full max-w-2xl mr-48">
      <TopList />
    </div>

    <div class="flex flex-col space-y-5 w-1/4">
      <div v-if="!storeAuth.user || (storeAuth.user && storeAuth.user.type !== 'A')" class="bg-blue-600 text-white p-6 rounded hover:bg-blue-500 transition-all w-full">
        <RouterLink to="/singleplayer" class="block text-center">
          <p class="text-3xl font-bold">Single-Player</p>
          <p class="text-lg mt-2">Joga agora e desafia a tua memória!</p>
        </RouterLink>
      </div>
      <div v-if="!storeAuth.user || (storeAuth.user && storeAuth.user.type !== 'A')" class="bg-gray-600 text-white p-6 rounded w-full cursor-not-allowed">
        <p class="text-3xl font-bold text-center">Multiplayer</p>
        <p class="text-lg text-center mt-2">Faz login para desbloquear este modo de jogo!</p>
      </div>
      <div class="bg-emerald-700 text-white p-4 rounded hover:bg-emerald-600 transition-all w-full">
        <RouterLink to="/statistics" class="block text-center">
          <p class="text-3xl font-bold">Estatísticas</p>
        </RouterLink>
      </div>
      <div class="bg-yellow-600 text-white p-4 rounded hover:bg-yellow-500 transition-all w-full">
        <RouterLink to="/shop" class="block text-center">
          <p class="text-3xl font-bold">Shop</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
