<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '@/stores/games';
import { useUserStore } from '@/stores/user'

const route = useRoute();
const gameStore = useGameStore();
const userStore = useUserStore() 

const allGameHistory = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10); 
const selectedUser = ref(null); 


const fetchGameHistory = async () => {
    await userStore.fetchUsers(); 
  selectedUser.value = userStore.users[8]; 
  console.log('Selected User:', selectedUser.value)
  const response = await gameStore.fetchGameHistory(selectedUser.value.id);
  allGameHistory.value = response;
};

const paginatedGameHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allGameHistory.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(allGameHistory.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  await fetchGameHistory();
});
</script>


<template>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-10">
    <h2 class="text-xl mb-4">Game History</h2>

    <table class="w-full text-left border-collapse border border-gray-700 table-fixed mb-4">
      <thead>
        <tr>
          <th class="border border-gray-700 px-4 py-2">Start Time</th>
          <th class="border border-gray-700 px-4 py-2">Board Size</th>
          <th class="border border-gray-700 px-4 py-2">Status</th>
          <th class="border border-gray-700 px-4 py-2">Total Time</th>
          <th class="border border-gray-700 px-4 py-2">Game Type</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game in paginatedGameHistory"
          :key="game.id"
          class="odd:bg-gray-700 even:bg-gray-600"
        >
          <td class="border border-gray-700 px-4 py-2">
            {{ new Date(game.began_at).toLocaleString() }}
          </td>
          <td class="border border-gray-700 px-4 py-2">
            {{ game.board.board_cols }}x{{ game.board.board_rows }}
          </td>
          <td class="border border-gray-700 px-4 py-2 capitalize">
            {{ game.status.toLowerCase() }}
          </td>
          <td class="border border-gray-700 px-4 py-2">
            {{ game.total_time ? game.total_time + 's' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-4 py-2 capitalize">
            {{ game.type === 'S' ? 'Single-Player' : 'Multiplayer' }}
          </td>
        </tr>
        <tr v-if="paginatedGameHistory.length === 0">
          <td colspan="5" class="text-center text-gray-500 p-4">
            No games found for this user.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="px-4 py-2 mx-1 text-gray-300">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>
