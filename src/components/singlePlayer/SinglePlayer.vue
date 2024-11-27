<script setup>
import { inject } from 'vue'
import { useMemoryGame } from '@/composable/memoryGame.js'
import Cell from './Cell.vue'
import { computed, onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/games';

const gameStore = useGameStore();
gameStore.fetchBoards();

const selectedBoard = ref(gameStore.boards[0]);

const gridClass = computed(() => {
  return {
    'grid-cols-3': numCols.value == 3,
    'grid-cols-4': numCols.value == 4,
    'grid-cols-6': numCols.value == 6,
  };
});

const {
  status,
  board,
  matched,
  gameTimer,
  gameTime,
  numCols,
  numRows,
  boardId,
  start,
  move,
} = useMemoryGame();



const updateBoard = () => {
  numCols.value = selectedBoard.value.numCols;
  numRows.value = selectedBoard.value.numRows;
  boardId.value = selectedBoard.value.id;
  start(); 
};

</script>

<template>
  <div class="p-8 mx-auto max-w-3xl min-w-96">
    <div class="my-4 p-3 flex items-center bg-gray-700 rounded-xl justify-between">
        <p class="text-center text-white text-xl px-2" v-show="!status"> 
            Select Board: 
        </p>
        <select
        v-model="selectedBoard"
        @change="updateBoard"
        class="px-4 py-2 rounded bg-gray-800 text-white " v-show="!status"
      >
        <option
          v-for="option in gameStore.boards"
          :key="option.label"
          :value="option"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="grow flex-col">
        <p class="text-center text-white text-xl font-bold" v-show="status">
          Game Time: {{ gameTimer || gameTime }}
        </p>
        <p class="text-center text-white text-lg" v-show="!status">
          Click on a card to start playing
        </p>
        <p class="text-center text-white text-lg" v-show="status == 1">
          You win!
        </p>
      </div>
    </div>
    <div class="grid border divide-x divide-y" :class="gridClass">
      <Cell
        v-for="cell in board"
        :key="cell.id"
        :matched="matched"
        :cell="cell"
        @card="move"
      >
      </Cell>
    </div>    
  </div>

</template>
