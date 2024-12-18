<script setup>
import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const userStore = useUserStore();
const games = ref([]);
const totalGames = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedType = ref('');
const selectedStatus = ref('');

const totalPages = computed(() => {
  return Math.ceil(totalGames.value / itemsPerPage.value);
});


const fetchGames = async () => {
  try {
    const { games: fetchedGames, total } = await userStore.fetchUserGames(
      props.id,
      currentPage.value,
      itemsPerPage.value,
      selectedType.value,
      selectedStatus.value
    );
    games.value = fetchedGames;
    totalGames.value = total;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
};


const filterGames = async () => {
  currentPage.value = 1;
  await fetchGames();
};


const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchGames();
  }
};

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchGames();
  }
};


onMounted(async () => {
  await fetchGames();
});
</script>

<template>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-1 overflow-x-auto">
    <div class="flex space-x-4 mb-1">
      <div>
        <label for="game-type" class="block text-xs mb-1">Filter by Type:</label>
        <select
          id="game-type"
          v-model="selectedType"
          @change="filterGames"
          class="border p-1 text-xs bg-gray-700 text-white rounded"
        >
          <option value="">All</option>
          <option value="S">Single-player</option>
          <option value="M">Multiplayer</option>
        </select>
      </div>

      <div>
        <label for="game-status" class="block text-xs mb-1">Filter by Status:</label>
        <select
          id="game-status"
          v-model="selectedStatus"
          @change="filterGames"
          class="border p-1 text-xs bg-gray-700 text-white rounded"
        >
          <option value="">All</option>
          <option value="PE">Pending</option>
          <option value="PL">In Progress</option>
          <option value="E">Ended</option>
          <option value="I">Interrupted</option>
        </select>
      </div>
    </div>

    <table class="w-full text-left border-collapse border border-gray-700 mb-4 text-xs">
      <thead>
        <tr class="bg-gray-700">
          <th class="border border-gray-700 px-2 py-2">Type</th>
          <th class="border border-gray-700 px-2 py-2">Creator</th>
          <th class="border border-gray-700 px-2 py-2">Winner</th>
          <th class="border border-gray-700 px-2 py-2">Status</th>
          <th class="border border-gray-700 px-2 py-2">Began At</th>
          <th class="border border-gray-700 px-2 py-2">Ended At</th>
          <th class="border border-gray-700 px-2 py-2">Duration (s)</th>
          <th class="border border-gray-700 px-2 py-2">Board</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game in games"
          :key="game.id"
          class="odd:bg-gray-800 even:bg-gray-700"
        >
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ game.type === 'S' ? 'Single-player' : 'Multiplayer' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ game.created_user_id }}</td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ game.winner_user_id || 'N/A' }}</td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ 
              game.status === 'PE' ? 'Pending' :
              game.status === 'PL' ? 'In Progress' :
              game.status === 'E' ? 'Ended' :
              'Interrupted' 
            }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ new Date(game.began_at).toLocaleString() }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ game.ended_at ? new Date(game.ended_at).toLocaleString() : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ game.total_time || 'N/A' }}</td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ game.board.board_cols+'x'+ game.board.board_rows}}</td>
        </tr>
        <tr v-if="games.length === 0">
          <td colspan="8" class="text-center text-gray-500 p-4">
            No games found for this user.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="px-4 py-2 mx-1 text-gray-300 text-xs">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>


