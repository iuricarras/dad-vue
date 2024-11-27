<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useUserStore } from '@/stores/user'
import {ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()


</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Your Transactions</h1>
    <UserTransactions :user="storeAuth.user" />
     
    
  </div>
</template>

