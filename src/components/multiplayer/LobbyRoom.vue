<script setup>
import { useLobbyStore } from '@/stores/lobby';
import Chat from '../chat/Chat.vue';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useGameStore } from '@/stores/games';
import Button from '../ui/button/Button.vue';
import { onBeforeRouteLeave } from 'vue-router';
import { ref } from 'vue';

const lobbyStore = useLobbyStore()
const gameStore = useGameStore()
const readyStatus = ref(false)

const startGame = async () => {
    await lobbyStore.startGame()
}

const readyGame = async () => {
    await lobbyStore.readyGame()
    readyStatus.value = true
}


onBeforeRouteLeave ((to, from) => {
    lobbyStore.leaveGame()
})
</script>

<template>
    <div class="flex flex-wrap justify-start space-x-4">
        <Chat class="w-96" :lobby="true"></Chat>
        <div class="flex-1 min-w-96">
            <Card class="my-8 py-2 px-1">
                <CardHeader class="pb-0">
                    <CardTitle>Lobby Number #{{ lobbyStore.lobbyID }}</CardTitle>
                </CardHeader>
                <CardContent class="p-4">
                    <div class="divide-y divide-solid divide-gray-200">
                        <div class="flex ps-2 pe-1">
                            <div class="flex flex-col grow">
                                <div class="text-base pe-4 grow leading-10 flex space-x-2">
                                    <span class="pl-1">Board Size: {{ gameStore.getBoardById(lobbyStore.boardId).label}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divide-y divide-solid divide-gray-200">
                        <div class="flex ps-2 pe-1">
                            <div class="flex flex-col grow">
                                <div class="text-base pe-4 grow leading-10 flex space-x-2">
                                    <span class="pl-1">Number of Players: {{ lobbyStore.game.numberCurrentPlayers}} / {{ lobbyStore.numberPlayers }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button @click="startGame" v-show="lobbyStore.canStartGame">Start Game</Button>
                    <Button @click="readyGame" v-show="!lobbyStore.canStartGame">{{readyStatus ? "Ready" : "Unready"}}</Button>
                </CardContent>
            </Card>
        </div>
    </div>
</template>