<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()

</script>
<template>
  <div class="p-4">
    <UserTransactions :id="storeAuth.user.id" />
  </div>
</template>

