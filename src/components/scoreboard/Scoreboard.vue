<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

const route = useRoute(); 
const userStore = useUserStore();
const authStore = useAuthStore();
const selectedUser = ref(null); 

const scoreboard = ref({
  single_player: [],
  multiplayer: { total_victories: 0, total_losses: 0 }
});

const fetchScoreboard = async () => {
  scoreboard.value = await userStore.fetchPersonalScoreboard();
};

onMounted(async () => {
  await fetchScoreboard();
});
</script>

<template>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-4xl mt-10">
    <h2 class="text-xl mb-4">Personal Scoreboard</h2>

    <h3 class="text-lg mb-2">Singleplayer</h3>
    <table class="w-full text-left border-collapse border border-gray-700 table-fixed mb-4">
      <thead>
        <tr>
          <th class="border border-gray-700 px-4 py-2">Board</th>
          <th class="border border-gray-700 px-4 py-2">Best Time</th>
          <th class="border border-gray-700 px-4 py-2">Minimum Turns</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="data in scoreboard.single_player"
          :key="data.board.id"
          class="odd:bg-gray-700 even:bg-gray-600"
        >
          <td class="border border-gray-700 px-4 py-2">
            {{ data.board.board_cols }}x{{ data.board.board_rows }}
          </td>
          <td class="border border-gray-700 px-4 py-2">{{ data.best_time }}s</td>
          <td class="border border-gray-700 px-4 py-2">{{ data.min_turns }}</td>
        </tr>
        <tr v-if="scoreboard.single_player.length === 0">
          <td colspan="3" class="text-center text-gray-500 p-4">
            No singleplayer games found.
          </td>
        </tr>
      </tbody>
    </table>

    <h3 class="text-lg mb-2">Multiplayer</h3>
    <table class="w-full text-left border-collapse border border-gray-700 table-fixed">
      <thead>
        <tr>
          <th class="border border-gray-700 px-4 py-2">Total Victories</th>
          <th class="border border-gray-700 px-4 py-2">Total Losses</th>
        </tr>
      </thead>
      <tbody>
        <tr class="odd:bg-gray-700 even:bg-gray-600">
          <td class="border border-gray-700 px-4 py-2">{{ scoreboard.multiplayer.total_victories }}</td>
          <td class="border border-gray-700 px-4 py-2">{{ scoreboard.multiplayer.total_losses }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
