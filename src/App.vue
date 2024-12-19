<script setup>
import { ref, useTemplateRef, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth.js';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';
import musica from '@/assets/natal.mp3';
import soundIcon from '@/assets/volume.png';
import muteIcon from '@/assets/mute.png';
import back from '@/assets/video.mp4';

const storeAuth = useAuthStore();
const showDropdown = ref(false);

const audioRef = ref(null);
const isMuted = ref(true); // Começa desligado (mutado)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.03; // Diminui o volume para 5% (ajuste conforme necessário)
  }
});


const toggleMute = () => {
  if (audioRef.value) {
    if (isMuted.value) {
      audioRef.value.play(); // Toca a música
    } else {
      audioRef.value.pause(); // Pausa a música
    }
    isMuted.value = !isMuted.value; // Atualiza o estado
  }
};

const alertDialog = useTemplateRef('alert-dialog');
provide('alertDialog', alertDialog);

const logoutConfirmed = () => {
  storeAuth.logout();
};

const logout = () => {
  alertDialog.value.open(
    logoutConfirmed,
    'Logout confirmation?',
    'Cancel',
    `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with your credentials.`
  );
};
</script>

<template>

  <div class="background-video-container">
    <video autoplay muted loop class="background-video">
      <source src="@/assets/video.mp4" type="video/mp4" />
      Does not support HTML5.
    </video>
    <div class="content">
      <slot></slot>
    </div>
  </div>


  <Toaster />
  
  <!-- Áudio -->
  <audio ref="audioRef" :src="musica" loop></audio>

  <!-- Botão de Ligar/Desligar Música -->
  <div 
  class="fixed bottom-4 right-4 rounded-lg shadow-lg z-[1]"
>
  <button
    @click="toggleMute"
    class="px-4 py-2 text-sm text-white rounded transition-colors"
    :class="isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'">
    <img
      :src="isMuted ? muteIcon : soundIcon"
      alt="Sound Icon"
      class="w-6 h-6 inline-block mr-2"/>
  </button>
</div>


  <nav class="relative flex justify-between items-center bg-gray-800 p-1 text-white">
    <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
    <RouterLink
      to="/home"
      class="flex items-center text-lg font-bold hover:text-blue-500 px-3 py-2 rounded-md transition-colors">
      <span>Memory Game</span>
      <img
        src="/src/assets/memory.png" alt="Memory Game Icon" class="ml-2 w-10 h-10"/>
    </RouterLink>

    <h1 class="flex-grow text-center font-bold">
      {{ storeAuth.userNick ? storeAuth.userNick : '' }}
    </h1>

    <div
      v-if="storeAuth.user?.type === 'P'"
      class="flex items-center mr-10 space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full">
      <span class="text-sm font-medium">
        <span class="text-lg">{{ storeAuth.user.brain_coins_balance }} 💰</span>
      </span>
      <RouterLink to="/shop">
        <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-full">
          +
        </button>
      </RouterLink>
    </div>

    <div class="flex items-center space-x-1 ml-auto pr-10">
      <RouterLink
        v-show="!storeAuth.user"
        to="/register"
        class="text-2x1 font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Register</span>
      </RouterLink>

      <RouterLink
        v-show="!storeAuth.user"
        to="/login"
        class="text-2x1 font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Login</span>
      </RouterLink>


      <div v-if="storeAuth.user" class="relative">
        <img
          class="w-10 h-10 rounded-full cursor-pointer dropdown-toggle"
          :src="storeAuth.userPhotoUrl"
          alt="User Avatar"
          @click="toggleDropdown"
        />

        <transition name="fade">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-4 w-48 bg-gray-200 rounded-lg shadow-lg py-2 z-10 text-gray-800 dropdown-menu">
            <RouterLink
              v-show="storeAuth.user.type === 'P'"
              to="/gameHistory"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown">
              Game History
            </RouterLink>
            <RouterLink
              v-show="storeAuth.user.type === 'P'"
              to="/scoreboard"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown">
              Scoreboard
            </RouterLink>
            <RouterLink
              v-show="storeAuth.user.type === 'P'"
              to="/transactions"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown">
              Transactions
            </RouterLink>
            <RouterLink
              v-show="storeAuth.user.type === 'A'"
              to="/users"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown">
              Users
            </RouterLink>
            <RouterLink
              v-show="storeAuth.user.type === 'P' || storeAuth.user.type === 'A'"
              to="/update"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown">
              Edit Profile
            </RouterLink>
            <button
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              v-show="storeAuth.user"
              @click="() => { logout(); closeDropdown(); }">
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>
  </nav>

  <RouterView></RouterView>
</template>


<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.background-video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1; /* Coloca o vídeo atrás do conteúdo */
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Garante que o vídeo cubra todo o fundo */
  transform: translate(-50%, -50%);
}

.content {
  position: relative; /* Garante que o conteúdo principal fique acima do vídeo */
  z-index: 1; /* Coloca o conteúdo acima do vídeo */
}
</style>