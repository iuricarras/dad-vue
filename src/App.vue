<script setup>
import { onMounted, useTemplateRef, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'


const storeAuth = useAuthStore()

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
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <nav class="flex justify-between items-center bg-gray-800 p-3 text-white">
    <!-- Memory Game como um link interativo para Home -->
    <RouterLink
      to="/home"
      class="text-lg font-medium hover:text-blue-500 px-3 py-2 rounded-md transition-colors">
      Memory Game
    </RouterLink>
    <!-- Links à direita para Register e Login -->
    <div class="flex space-x-4">
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
      <button v-show="storeAuth.user" @click="logout" class="w-24 h-10 leading-10 text-center rounded-t-xl
          border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500">
                  Logout
      </button>
    </div>
  </nav>
  <RouterView></RouterView>
</template>