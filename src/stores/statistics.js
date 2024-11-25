import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useStatisticsStore = defineStore('statistics', () => {
    
    const totalUsers = ref(0);
    const totalGames = ref(0);
    const mostPlayedBoard = ref('');
    const totalPurchases = ref(0);

    const gamesPerMonthData = ref([]);
    const purchasesPerMonthData = ref([]);

    const statisticsLoaded = computed(() => {
        return totalUsers.value > 0 && totalGames.value > 0;
    });

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/statistics');
            totalUsers.value = response.data.total_users;
            totalGames.value = response.data.total_games;
            mostPlayedBoard.value = response.data.most_played_board;
            totalPurchases.value = response.data.total_purchases;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const fetchGamesPerMonth = async () => {
        try {
            const response = await axios.get('/statistics/games-per-month');
            gamesPerMonthData.value = response.data;
        } catch (error) {
            console.error('Erro ao buscar jogos por mês:', error);
        }
    };

    const fetchPurchasesPerMonth = async () => {
        try {
            const response = await axios.get('/statistics/purchases-per-month');
            purchasesPerMonthData.value = response.data;
        } catch (error) {
            console.error('Erro ao buscar compras por mês:', error);
        }
    };

    return {
        totalUsers,
        totalGames,
        mostPlayedBoard,
        totalPurchases,
        gamesPerMonthData,
        purchasesPerMonthData,
        statisticsLoaded,
        fetchStatistics,
        fetchGamesPerMonth,
        fetchPurchasesPerMonth,
    };
});
