<script setup>
import { ref, useTemplateRef, provide, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth.js';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';

const storeAuth = useAuthStore();
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown-menu');
  const avatar = document.querySelector('.dropdown-toggle');
  if (
    dropdown &&
    !dropdown.contains(event.target) &&
    avatar &&
    !avatar.contains(event.target)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

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
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
        v-slot="{ isActive }">
        <span :class="{ 'text-blue-500': isActive }">Register</span>
      </RouterLink>

      <RouterLink
        v-show="!storeAuth.user"
        to="/login"
        class="text-sm font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors"
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
              Atualizar Dados
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
</style>
