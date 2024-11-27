<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import UserTable from '@/components/user/UserTable.vue';
import UserTransactions from '@/components/transaction/UserTransactions.vue';

const userStore = useUserStore();
const selectedUser = ref(null);

onMounted(() => {
  userStore.fetchUsers();
});

const handleViewTransactions = (user) => {
  selectedUser.value = user;
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <UserTable :users="userStore.users" @viewTransactions="handleViewTransactions" />
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
      <div class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" style="max-height: 90vh; overflow-y: auto; overflow-x: auto;">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Transactions for {{ selectedUser.nickname? selectedUser.nickname:null}}
          </h3>
          <button @click="selectedUser = null" class="text-red-500">
            Close
          </button>
        </div>
        <UserTransactions v-if="selectedUser" :id="selectedUser.id"/>
      </div>
    </div>
  </div>
</template>

