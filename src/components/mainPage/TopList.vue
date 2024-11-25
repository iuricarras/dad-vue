<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/games';

const gameStore = useGameStore();
const selectedBoard = ref(null);
const selectedGameType = ref('S');
const boards = ref([]);

const fetchBoards = async () => {
  await gameStore.fetchBoards();
  boards.value = gameStore.boards;
  selectedBoard.value = boards.value.find((board) => board.label === '3x4');
};

const fetchGames = async () => {
  if (selectedGameType.value === 'S') {
    await gameStore.fetchTopSinglePlayerGames(selectedBoard.value?.id || null);
  } else if (selectedGameType.value === 'M') {
    await gameStore.fetchTopMultiplayerGames(selectedBoard.value?.id || null);
  }
};

onMounted(async () => {
  await fetchBoards();
  await fetchGames();
});

const handleGameTypeChange = async (type) => {
  selectedGameType.value = type;
  await fetchGames();
};

const handleBoardChange = async () => {
  await fetchGames();
};
</script>

<template>
    <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl">Top Games</h2>
        <div class="flex space-x-4">
          <button
            @click="handleGameTypeChange('S')"
            class="px-4 py-2 rounded"
            :class="selectedGameType === 'S' 
              ? 'bg-blue-600 border-2 border-white font-bold' 
              : 'bg-blue-500 hover:bg-blue-600 border border-gray-500'"
          >
            Single Player
          </button>
          <button
            @click="handleGameTypeChange('M')"
            class="px-4 py-2 rounded"
            :class="selectedGameType === 'M' 
              ? 'bg-green-600 border-2 border-white font-bold' 
              : 'bg-green-500 hover:bg-green-600 border border-gray-500'"
          >
            Multiplayer
          </button>
  
          <select
            v-model="selectedBoard"
            @change="handleBoardChange"
            class="px-4 py-2 bg-gray-700 text-white rounded"
          >
            <option
              v-for="board in boards"
              :key="board.id"
              :value="board"
            >
              {{ board.label }}
            </option>
          </select>
        </div>
      </div>
  
      <div class="overflow-x-auto max-w-lg mx-auto">
        <table class="w-full text-left border-collapse border border-gray-700 table-fixed">
          <thead>
            <tr>
              <th class="border border-gray-700 px-4 py-2 w-1/3">User / Winner</th>
              <th class="border border-gray-700 px-4 py-2 w-1/3">Time</th>
              <th class="border border-gray-700 px-4 py-2 w-1/3">Board</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="game in gameStore.games"
              :key="game.id"
              class="odd:bg-gray-700 even:bg-gray-600"
            >
              <td class="border border-gray-700 px-4 py-2 truncate">
                {{ game.user?.nickname || game.winner?.nickname || 'N/A' }}
              </td>
              <td class="border border-gray-700 px-4 py-2 truncate">
                {{ game.total_time || 'N/A' }}s
              </td>
              <td class="border border-gray-700 px-4 py-2 truncate">
                {{ game.board?.board_cols || 3 }}x{{ game.board?.board_rows || 3 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  