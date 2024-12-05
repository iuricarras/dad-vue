<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()

</script>
<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Transactions</h2>
    <UserTransactions :id="storeAuth.user.id" />
  </div>
</template>

