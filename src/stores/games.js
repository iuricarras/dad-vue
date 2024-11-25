import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';
import { useRouter } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';

export const useGameStore = defineStore('game', () => {
    const router = useRouter();
    const { toast } = useToast();
    const storeError = useErrorStore();

    const games = ref([]);
    const boards = ref([]);

    const totalGames = computed(() => {
        return games.value ? games.value.length : 0;
    });

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/boards');
            boards.value = response.data.map(board => ({
                id: board.id,
                label: `${board.board_cols}x${board.board_rows}`
            }));
            console.log('Boards disponíveis:', boards.value);
        } catch (error) {
            console.error('Erro ao buscar boards:', error);
        }
    };

    const fetchGames = async () => {
        storeError.resetMessages();
        try {
            const response = await axios.get('games');
            games.value = response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error fetching games!');
        }
    };

    const fetchGame = async (gameId) => {
        storeError.resetMessages();
        try {
            const response = await axios.get(`games/${gameId}`);
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error fetching game!');
            return false;
        }
    };

    const fetchTopSinglePlayerGames = async (boardId) => {
        try {
            const response = await axios.get('/games/topSinglePlayer', {
                params: { board_id: boardId },
            });
            games.value = response.data.slice(0, 5);
            console.log('Top 5 Single Player Games for board:', boardId, games.value);
        } catch (error) {
            console.error('Erro ao buscar top Single Player para a board:', error);
        }
    };
    
    const fetchTopMultiplayerGames = async (boardId) => {
        try {
            const response = await axios.get('/games/topMultiplayer', {
                params: { board_id: boardId },
            });
            games.value = response.data.slice(0, 5);
            console.log('Top 5 Multiplayer Games for board:', boardId, games.value);
        } catch (error) {
            console.error('Erro ao buscar top Multiplayer para a board:', error);
        }
    };

    const insertGame = async (game) => {
        storeError.resetMessages();
        try {
            const response = await axios.post('games', game);
            games.value.push(response.data.data);
            toast({
                description: `Game #${response.data.data.id} created successfully!`,
                action: h(ToastAction, {
                    altText: `Open new game`,
                    onclick: () => {
                        router.push({ name: 'showGame', params: { id: response.data.data.id } });
                    },
                }, {
                    default: () => `Open new game`,
                }),
            });
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating game!');
            return false;
        }
    };
    
    return {
        games,
        boards,
        totalGames,
        fetchBoards,
        fetchGames,
        fetchGame,
        fetchTopSinglePlayerGames,
        fetchTopMultiplayerGames,
        insertGame,
    };
});
