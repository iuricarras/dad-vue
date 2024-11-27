<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useUserStore } from '@/stores/user'
import {ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()


</script>

<template>
  <div class="p-4">
    <UserTransactions :user="storeAuth.user" />
     
    
  </div>
</template>

