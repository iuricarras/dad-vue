<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useUserStore } from '@/stores/user'
import {ref, onMounted } from 'vue';
//import { useAuthStore } from '@/stores/auth';
//const storeAuth = useAuthStore()

const userStore = useUserStore() 
const selectedUser = ref(null); 

onMounted(async () => {
  await userStore.fetchUsers(); 
  selectedUser.value = userStore.users[8]; 
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4" v-if="selectedUser">Your Transactions {{selectedUser.nickname}}</h1>
    <!-- <UserTransactions :user="userStore.user" @close="userStore.user=null" /> -->
     
    <UserTransactions  v-if="selectedUser" :user="selectedUser" />
  </div>
</template>

