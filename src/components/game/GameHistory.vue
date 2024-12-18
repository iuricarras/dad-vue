<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useGameStore } from '@/stores/games';

const userStore = useUserStore();
const gameStore = useGameStore();

const gameHistory = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const filteredGameHistory = ref([]);
const selectedType = ref('');
const selectedBoard = ref('');
const boards = ref([]);
const totalPages = ref(1);

const fetchGameHistory = async () => {
  isLoading.value = true;
  errorMessage.value = ''; 
  try {
    const response = await userStore.fetchAuthenticatedGameHistory({
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      type: selectedType.value || null,
      board: selectedBoard.value || null,
    });
    gameHistory.value = response.games;
    filteredGameHistory.value = response.games;

    if (response.total) {
      totalPages.value = Math.ceil(response.total / itemsPerPage.value);
    }
  } catch (error) {
    console.error('Failed to load game history.', error);
    errorMessage.value = 'Failed to load game history.';
  } finally {
    isLoading.value = false;
  }
};


const fetchBoards = async () => {
  try {
    await gameStore.fetchBoards();
    boards.value = gameStore.boards;
  } catch {
    console.error('Failed to fetch boards.');
  }
};

const filterGames = async () => {
  currentPage.value = 1; // Reinicia para a primeira página
  await fetchGameHistory(); // Faz um novo pedido à API com os filtros atualizados
};


const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchGameHistory();
  }
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchGameHistory();
  }
};

onMounted(async () => {
  await fetchBoards();
  await fetchGameHistory();
});
</script>

<template>
  <h2 class="text-2xl font-bold text-white-800 mb-4 p-4">Game History</h2>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-1">
    <div class="flex space-x-4 mb-4">
      <div>
        <label for="game-type" class="block text-sm mb-1">Filter by Game Type:</label>
        <select
          id="game-type"
          v-model="selectedType"
          @change="filterGames"
          class="border p-2 bg-gray-700 text-white rounded"
        >
          <option value="">All</option>
          <option value="S">Single-player</option>
          <option value="M">Multiplayer</option>
        </select>
      </div>

      <div>
        <label for="board-filter" class="block text-sm mb-1 ">Filter by Board:</label>
        <select
          id="board-filter"
          v-model="selectedBoard"
          @change="filterGames"
          class="border p-2 bg-gray-700 text-white rounded"
        >
          <option value="">All</option>
          <option v-for="board in boards" :key="board.id" :value="board.id">
            {{ board.label }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="errorMessage" class="text-center text-red-500 p-4">
      {{ errorMessage }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse border border-gray-700 mb-4">
        <thead>
          <tr>
            <th class="border border-gray-700 px-2 py-2">Created By</th>
            <th class="border border-gray-700 px-2 py-2">Winner</th>
            <th class="border border-gray-700 px-2 py-2">Start Time</th>
            <th class="border border-gray-700 px-2 py-2">Board Size</th>
            <th class="border border-gray-700 px-2 py-2">Status</th>
            <th class="border border-gray-700 px-2 py-2">Total Time</th>
            <th class="border border-gray-700 px-2 py-2">Turns</th>
            <th class="border border-gray-700 px-2 py-2">Game Type</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in filteredGameHistory"
            :key="game.id"
            class="odd:bg-gray-700 even:bg-gray-600"
          >
            <td class="border border-gray-700 px-1 py-1">
              {{ game.creator ? game.creator.nickname : 'Unknown' }}
            </td>
            <td class="border border-gray-700 px-1 py-1">
              {{ game.type === 'M' ? (game.winner ? game.winner.nickname : 'No Winner') : '____' }}
            </td>
            <td class="border border-gray-700 px-1 py-1">
              {{ new Date(game.began_at).toLocaleString() }}
            </td>
            <td class="border border-gray-700 px-1 py-1">
              {{ game.board.board_cols }}x{{ game.board.board_rows }}
            </td>
            <td class="border border-gray-700 px-1 py-1 capitalize">
              {{ game.status.toLowerCase() }}
            </td>
            <td class="border border-gray-700 px-1 py-1">
              {{ game.total_time ? game.total_time + 's' : 'N/A' }}
            </td>
            <td class="border border-gray-700 px-1 py-1">
              {{ game.total_turns_winner ? game.total_turns_winner : 'N/A' }}
            </td>
            <td class="border border-gray-700 px-1 py-1 capitalize">
              {{ game.type === 'S' ? 'Single-Player' : 'Multiplayer' }}
            </td>
          </tr>
          <tr v-if="gameHistory.length === 0">
            <td colspan="7" class="text-center text-gray-500 p-4">
              No games found for this user.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center mt-4">
        <button
          class="px-1 py-1 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Prev
        </button>
        <span class="px-1 py-1 mx-1 text-gray-300">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="px-1 py-1 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
