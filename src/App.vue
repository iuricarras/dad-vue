<script setup>
import { ref, useTemplateRef, provide } from 'vue';
import { RouterView } from 'vue-router';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth.js';
import avatarNoneAssetURL from '@/assets/avatar-none.png';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';

const storeAuth = useAuthStore();
const showDropdown = ref(false); 

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
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
  <Toaster />
  <nav class="relative flex justify-between items-center bg-gray-800 p-3 text-white">
    <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
    <RouterLink
      to="/home"
      class="text-lg font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors">
      Memory Game
    </RouterLink>

    <h1 class="flex-grow text-center">
      {{ storeAuth.userFirstLastName ? storeAuth.userFirstLastName : '' }}
    </h1>

    <div v-if="storeAuth.user?storeAuth.user.type=='P':false" class="flex items-center mr-10 space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full">
      <span class="text-sm font-medium">
        
        <span class="text-lg">{{ storeAuth.user.brain_coins_balance }} 💰</span>
      </span>
      <RouterLink to="/shop">
        <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-full">
          +
        </button>
      </RouterLink>
    </div>
    
    <div class="flex items-center space-x-10 ml-auto pr-10">
      <RouterLink v-show="!storeAuth.user" to="/register"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Register</span>
      </RouterLink>

      <RouterLink v-show="!storeAuth.user" to="/login"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Login</span>
      </RouterLink>

      <div v-if="storeAuth.user" class="relative">
        <img 
          class="w-10 h-10 rounded-full cursor-pointer" 
          :src="storeAuth.userPhotoUrl" 
          alt="Rounded avatar" 
          @click="toggleDropdown"
        />
        
        <transition name="fade">
          <div 
            v-if="showDropdown" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 text-gray-800"
          >
            <RouterLink v-show="storeAuth.user.type=='P'"
              to="/gameHistory"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown"
            >
              Game History
            </RouterLink>
            <RouterLink v-show="storeAuth.user.type=='P'"
              to="/scoreboard"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown"
            >
              Scoreboard
            </RouterLink>
            <RouterLink v-show="storeAuth.user.type=='P'"
              to="/transactions"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              @click="closeDropdown"
            >
              Transactions
            </RouterLink>
            <RouterLink v-show="storeAuth.user.type=='A'"
              to="/users"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
               @click="closeDropdown"
            >
              Users
            </RouterLink>

            <RouterLink v-show="storeAuth.user.type=='P' || 'A'"
              to="/update"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
               @click="closeDropdown"
            >
              User-Update
            </RouterLink>



            <button
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              v-show="storeAuth.user" @click="() => { logout(); closeDropdown(); }"
            >
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
