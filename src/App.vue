<script setup>
import { ref,useTemplateRef,provide } from 'vue';
import { RouterView } from 'vue-router';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth.js';
import avatarNoneAssetURL from '@/assets/avatar-none.png';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'


const storeAuth = useAuthStore();
const showDropdown = ref(false); // Gerencia a visibilidade do dropdown

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};




const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const logoutConfirmed = () => {
    storeAuth.logout()
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed, 'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
       `Are you sure you want to log out? You can still access your account later with your credentials.`)
}

</script>

<template>
  <Toaster />
  <nav class="relative flex justify-between items-center bg-gray-800 p-3 text-white">
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
    <!-- Memory Game como um link interativo para Home -->
    <RouterLink
      to="/home"
      class="text-lg font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors">
      Memory Game
    </RouterLink>

    <h1 class="flex-grow text-center">
      {{ storeAuth.userFirstLastName ? storeAuth.userFirstLastName : '' }}
    </h1>

    <div class="flex items-center mr-10 space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full">
      <span class="text-sm font-medium">
        {{ storeAuth.userBrainCoins }} 
        <span class="text-lg">5💰</span>
      </span>
      <RouterLink to="/shop">
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
          +
        </button>
      </RouterLink>
    </div>
    
    <div class="flex items-center space-x-10 ml-auto pr-10">
      <RouterLink
        to="/register"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Register</span>
      </RouterLink>

      <RouterLink v-show="!storeAuth.user" to="/login"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Login</span>
      </RouterLink>

      
      <div class="relative">
        <img 
          class="w-10 h-10 rounded-full cursor-pointer" 
          :src="avatarNoneAssetURL" 
          alt="Rounded avatar" 
          @click="toggleDropdown"
        />
        
        <transition name="fade">
          <div 
            v-if="showDropdown" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 text-gray-800"
          >
            <button
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              v-show="storeAuth.user" @click="logout"
            >
              Logout
            </button>
            <RouterLink
              to="/transactions"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Transactions
            </RouterLink>
          </div>
        </transition>
      </div>
    
    </div>
  </nav>
  <RouterView></RouterView>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
