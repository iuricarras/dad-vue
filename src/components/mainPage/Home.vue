<script setup>
import { inject } from 'vue'


</script>

<template>
  <div class="flex h-screen items-center justify-center px-10 -mt-10">
    <!-- Container Principal com largura total -->
    <div class="flex justify-between items-start w-full max-w-screen-xl px-10"> <!-- Expandindo a largura máxima e ajustando o padding interno -->
      <!-- Seção de Título e Colunas com alinhamento mais à esquerda -->
      <div class="bg-gray-800 text-white p-7 rounded-lg w-1/2"> <!-- Ajuste de largura para a seção Top -->
        <h2 class="text-xl mb-6 text-center">Top</h2>
        <div class="flex justify-between space-x-4">
          <div class="p-3 text-center w-1/3 bg-blue-500 text-white rounded">User</div>
          <div class="p-3 text-center w-1/3 bg-blue-500 text-white rounded">Time</div>
          <div class="p-3 text-center w-1/3 bg-blue-500 text-white rounded">Board</div>
        </div>
      </div>
      
      <!-- Container para os Botões organizados verticalmente -->
      <div class="flex flex-col space-y-5 w-1/3"> <!-- Ajuste de largura para os botões -->
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