<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import UserTable from '@/components/user/UserTable.vue';
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import UserGames from '@/components/user/UserGames.vue';

const userStore = useUserStore();
const selectedUser = ref(null);
const activeModal = ref(''); // 'transactions' ou 'games'

onMounted(() => {
  userStore.fetchUsers();
});

const handleViewTransactions = (user) => {
  selectedUser.value = user;
  activeModal.value = 'transactions';
};

const handleViewGames = (user) => {
  selectedUser.value = user;
  activeModal.value = 'games';
};

const closeModal = () => {
  selectedUser.value = null;
  activeModal.value = '';
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- Tabela de usuários -->
    <UserTable 
      :users="userStore.users" 
      @viewTransactions="handleViewTransactions" 
      @viewGames="handleViewGames"
    />

    <!-- Modal de transações -->
    <div 
      v-if="activeModal === 'transactions'" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" 
        style="max-height: 90vh; overflow-y: auto;"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Transactions for {{ selectedUser?.nickname }}
          </h3>
          <button @click="closeModal" class="text-red-500">
            Close
          </button>
        </div>
        <UserTransactions v-if="selectedUser" :id="selectedUser.id" />
      </div>
    </div>

    <!-- Modal de jogos -->
    <div 
      v-if="activeModal === 'games'" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" 
        style="max-height: 90vh; overflow-y: auto;"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Games for {{ selectedUser?.nickname }}
          </h3>
          <button @click="closeModal" class="text-red-500">
            Close
          </button>
        </div>
        <UserGames v-if="selectedUser" :id="selectedUser.id" />
      </div>
    </div>
  </div>
</template>
