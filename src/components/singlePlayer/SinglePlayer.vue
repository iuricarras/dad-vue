<script setup>
import { inject } from 'vue'
import { useMemoryGame } from '@/composable/memoryGame.js'
import Cell from './Cell.vue'
import { computed, onMounted, ref } from 'vue';


const gridClass = computed(() => {
    return {
        'grid-cols-4': numCols.value == 4,
        'grid-cols-6': numCols.value == 6,
    }
})

const {
    status,
    board,
    matched,
    gameTimer,
    gameTime,
    numCols,
    numRows,
    start,
    move
} = useMemoryGame()

console.log("board", board)

onMounted(() => {
    start()
})

</script>

<template>


<div class="p-8 mx-auto max-w-3xl min-w-96">
    <div :v-if="numCol">
        <div class="my-4 p-3 flex items-center bg-green-200 rounded-xl">
            <div class="grow flex-col">
                <p class="text-center text-xl font-bold">Game Time: {{ gameTimer || gameTime}}</p>
                <p class="text-center text-lg" v-show="!status">Click on a card to start playing</p>
                <p class="text-center text-lg" v-show="(status==1)">You win!</p>
            </div>
            <button type="button"
                class="rounded bg-green-700 py-2 px-3 m-0.5 text-white flex shadow-lg shadow-green-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span class="ps-2 text-base" @click="start">Restart</span>
            </button>
        </div>
        <div class="grid border divide-x divide-y" :class="gridClass">
            <Cell v-for="cell in board" :matched="matched" :cell="cell" @card="move">
            </Cell>
        </div>
    </div>
</div>
</template>