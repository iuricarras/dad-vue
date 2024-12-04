<script setup>
import { onMounted, ref } from 'vue';
import { useStatisticsStore } from '@/stores/statistics';
import { Chart, registerables } from 'chart.js';
import { useAuthStore } from '@/stores/auth';

Chart.register(...registerables);

const statisticsStore = useStatisticsStore();
const storeAuth = useAuthStore();

const nickname = ref('');
const playerPurchases = ref(null);

onMounted(async () => {
  await statisticsStore.fetchStatistics();
  await statisticsStore.fetchGamesPerMonth();
  await statisticsStore.fetchPurchasesPerMonth();
  await statisticsStore.fetchGamesPerWeek();
  await statisticsStore.fetchPurchasesPerWeek();
  renderGamesByWeekChart();
  renderGamesChart();
  if (storeAuth.user?.type == 'A') {
    renderPurchasesChart();
    renderPurchasesByWeekChart();
  }
});

const searchPlayerPurchases = async () => {
  if (!nickname.value.trim()) {
    playerPurchases.value = null;
    return;
  }
  await statisticsStore.fetchPurchasesByPlayer(nickname.value);
  playerPurchases.value = statisticsStore.playerPurchases;
};

const renderGamesChart = () => {
  const ctx = document.getElementById('gamesChart').getContext('2d');
  const labels = statisticsStore.gamesPerMonthData.map(
    (item) => `${item.year}-${item.month.toString().padStart(2, '0')}`
  );
  const data = statisticsStore.gamesPerMonthData.map((item) => item.total_games);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Jogos por Mês',
          data,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
  });
};

const renderPurchasesChart = () => {
  const ctx = document.getElementById('purchasesChart').getContext('2d');
  const labels = statisticsStore.purchasesPerMonthData.map(
    (item) => `${item.year}-${item.month.toString().padStart(2, '0')}`
  );
  const data = statisticsStore.purchasesPerMonthData.map((item) => item.total_purchases);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Compras por Mês',
          data,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
  });
};

const renderGamesByWeekChart = () => {
  const ctx = document.getElementById('gamesByWeekChart').getContext('2d');
  const labels = statisticsStore.gamesPerWeekData.map(
    (item) => `Week ${item.week} of ${item.year}`
  );
  const data = statisticsStore.gamesPerWeekData.map((item) => item.total_games);

  new Chart(ctx, {
    type: 'line', 
    data: {
      labels,
      datasets: [
        {
          label: 'Jogos por Semana',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
  });
};

const renderPurchasesByWeekChart = () => {
  const ctx = document.getElementById('purchasesByWeekChart').getContext('2d');
  const labels = statisticsStore.purchasesPerWeekData.map(
    (item) => `Week ${item.week} of ${item.year}`
  );
  const data = statisticsStore.purchasesPerWeekData.map((item) => item.total_purchases);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Compras por Semana',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
  });
};
</script>

<template>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-12">
    <h2 class="text-2xl mb-6 text-center font-bold">Estatísticas</h2>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Total de Registos</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalUsers }}</p>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Total de Jogos Jogados</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalGames }}</p>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Board Mais Jogada</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.mostPlayedBoard }}</p>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md" v-if="storeAuth.user?storeAuth.user.type=='A': false">
        <h3 class="text-lg font-bold text-center">Total de Compras</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalPurchases }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      <div class="bg-gray-300 text-black rounded-lg p-6 shadow-md mb-8">
        <h3 class="text-lg font-bold text-center mb-4">Total de Jogos Jogados por Semana</h3>
        <canvas id="gamesByWeekChart" width="400" height="200"></canvas>
      </div>
      <div v-if="storeAuth.user?storeAuth.user.type=='A': false"  class="bg-gray-300 text-black rounded-lg p-6 shadow-md mb-8">
        <h3 class="text-lg font-bold text-center mb-4">Total de Compras por Semana</h3>
        <canvas id="purchasesByWeekChart" width="400" height="200"></canvas>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 shadow-md">
        <h3 class="text-lg font-bold text-center mb-4">Total de Jogos Jogados por Mês</h3>
        <canvas id="gamesChart" width="400" height="200"></canvas>
      </div>
      <div v-if="storeAuth.user?storeAuth.user.type=='A': false" class="bg-gray-300 text-black rounded-lg p-6 shadow-md" >
        <h3 class="text-lg font-bold text-center mb-4">Total de Compras por Mês</h3>
        <canvas id="purchasesChart" width="400" height="200"></canvas>
      </div>
    </div>
  <div v-if="storeAuth.user?storeAuth.user.type=='A': false" class="bg-gray-300 text-black rounded-lg p-6 shadow-md mb-8">
    <h3  class="text-lg font-bold text-center mb-4">Pesquisar Compras por Jogador</h3>
      <div  class="flex items-center space-x-4">
        <input
          v-model="nickname"
          @input="searchPlayerPurchases"
          type="text"
          placeholder="Escreva  o nickname"
          class="px-4 py-2 border border-gray-400 rounded-lg w-full"
        />
      </div>
      <div v-if="playerPurchases !== null" class="mt-4 text-center">
        <p class="text-xl font-bold">
          Total de Compras "{{ nickname }}": 
          <span class="text-green-600">{{ playerPurchases }} €</span>
        </p>
      </div>
      <div v-else class="mt-4 text-center text-gray-500">
        Escreva um nickname válido para pesquisar.
      </div>
  </div>

  </div>
</template>
