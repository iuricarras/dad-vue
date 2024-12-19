import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useToast } from '@/components/ui/toast/use-toast';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'


export const useLobbyStore = defineStore('lobby', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const router = useRouter()
    const socket = inject('socket')

    const { toast } = useToast();

    const lobbyID = ref(-1)
    const boardId = ref(-1)
    const numberPlayers = ref(-1)
    const gameStatus = ref(-1)
    const matched = ref(false)


    const time = ref(20)
    const timerID = ref(null)
    const games = ref([])
    const game = ref(null)

    const totalGames = computed(() => games.value.length)

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    const verifyTimer = async () => {
        const player = game.value.players.find(player => player.player.id == storeAuth.id)
        console.log(game.value.currentPlayer)
        if (game.value.currentPlayer == player.id && !game.value.firstCard) {
            console.log("Player turn")
            clearInterval(timerID.value);
            time.value = 20;
            await timer();
        } else if (game.value.currentPlayer != player.id && !game.value.firstCard) {
            clearInterval(timerID.value);
            time.value = 20;
        }
    };

    const timer = async () => {
        timerID.value = setInterval(() => {
            time.value = time.value - 1;
            console.log(time.value);
            if (time.value == 0) {
                clearInterval(timerID.value);
                quit();
            }
        }, 1000);

    }
    // when the lobby changes on the server, it is updated on the client
    socket.on('lobbyChanged', (lobbyGames) => {
        games.value = lobbyGames
    })

    socket.on('gameLobbyChanged', (gameLobby) => {
        game.value = { ...gameLobby }
    })

    socket.on('gameStarted', (gameStarting) => {
        game.value = { ...gameStarting }
        gameStatus.value = gameStarting.status
        console.log(game.value);
        router.push({ name: 'Game' })

    })

    socket.on('gameChanged', (gameChanged) => {
        game.value = { ...gameChanged }
        gameStatus.value = gameChanged.status
        console.log("Não devia estar aqui")
        if (!gameChanged.firstCard) {
            matched.value = false;
        }
        if (gameStatus != 2) {
            verifyTimer();
        }
    })

    socket.on('gameEnded', async (gameEnded) => {
        clearInterval(timerID.value);
        game.value = { ...gameEnded }
        console.log(gameEnded)
        gameStatus.value = gameEnded.status
        if (gameEnded.playerWin == storeAuth.id) {
            toast({
                description: `You won the game!`
            })
            let gameDB = {}
            gameDB.id = gameEnded.gameDBID
            gameDB.status = "E"
            gameDB.winner_user_id = storeAuth.id
            gameDB.ended_at = new Date(Date.now()).toISOString();
            gameDB.players = game.value.players
            gameDB.type = "M"
            gameDB.board_id = game.value.boardId

            const APIResponse = await axios.put(`/games/${gameDB.id}`, gameDB)

            toast({
                description: `Game #${APIResponse.data.data.id} updated successfully!`
            })

        }
        else {
            toast({
                description: `You lost`
            })
        }
    })

    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        socket.emit('fetchGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    // add a game to the lobby
    const addGame = (information) => {
        storeError.resetMessages()
        if (storeAuth.brain_coins_balance < 5) {
            storeAuth.brainCoinsBalanceError(5);
            return
        }
        socket.emit('addGame', information, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            lobbyID.value = response.id
            boardId.value = response.boardId
            numberPlayers.value = response.numberPlayers
            game.value = response
            router.push({ name: 'Lobby' })
        })
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        socket.emit('removeGame', id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // join a game of the lobby
    const joinGame = (id) => {
        storeError.resetMessages()
        if (storeAuth.brain_coins_balance < 5) {
            storeAuth.brainCoinsBalanceError(5);
            return
        }
        socket.emit('joinGame', id, async (response) => {
            // callback executed after the join is complete
            if (webSocketServerResponseHasError(response)) {
                return
            }

            // const APIresponse = await axios.post('games', {
            //     player1_id: response.player1.id,
            //     player2_id: response.player2.id,
            // })
            // const newGameOnDB = APIresponse.data.data
            // newGameOnDB.player1SocketId = response.player1SocketId
            // newGameOnDB.player2SocketId = response.player2SocketId
            // // After adding the game to the DB emit a message to the server to start the game
            // socket.emit('startGame', newGameOnDB, (startedGame) => {
            //     console.log('Game has started', startedGame)
            // })

            lobbyID.value = id;
            boardId.value = response.boardId
            numberPlayers.value = response.numberPlayers
            game.value = response

            router.push({ name: 'Lobby' })
        })
    }

    const leaveGame = () => {
        storeError.resetMessages()
        socket.emit('leaveGame', game.value.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    const startGame = async () => {
        storeError.resetMessages()
        game.value.type = "M";
        game.value.status = "PL"
        game.value.board_id = boardId.value
        game.value.began_at = new Date(Date.now()).toISOString();
        try {
            const APIResponse = await axios.post('/games', game.value);
            toast({
                description: `Game #${APIResponse.data.data.id} created successfully!`
            })

            game.value.gameDBID = APIResponse.data.data.id;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating game!');
            return false;
        }

        socket.emit('startGame', lobbyID.value, game.value, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    const move = (cardID) => {
        if (matched.value) {
            return;
        }
        if (game.value.firstCard) {
            console.log("First card - matched a true")
            matched.value = true;
        }

        socket.emit('move', cardID, lobbyID.value, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    };

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = (game) => {
        return game.players[0].player.id === storeAuth.id
    }

    const canStartGame = computed(() => {
        console.log("IM HERE")
        console.log(`Value + ${game.value}`)
        console.log(game.value.players[0].player.id)
        console.log(storeAuth.id)
        console.log("IM HERE")
        return game.value.players[0].player.id == storeAuth.id
    })

    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return storeAuth.user && game.players[0].player.id !== storeAuth.id
    }

    const quit = () => {
        storeError.resetMessages()
        socket.emit('quitGame', game.value.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    const readyGame = () => {
        storeError.resetMessages()
        socket.emit('readyGame', game.value.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    return {
        games, game, totalGames, lobbyID, boardId, numberPlayers, gameStatus, time, matched, fetchGames, addGame, joinGame, canJoinGame, removeGame, canRemoveGame, canStartGame,
        startGame, move, quit, leaveGame, readyGame
    }
})