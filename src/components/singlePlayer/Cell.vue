<script setup>
import { computed } from 'vue'
const props = defineProps({
    cell: Object,
    matched: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['card'])

const clicked = () => {
    if(!props.matched && !props.cell.isRevealed){
        console.log('clicked')
        console.log(props.matched)
        emit('card', props.cell)
    }
    // props.cell.isRevealed = true
    // setTimeout(() => {
    //     props.cell.isMatched = true
    // }, 2000);

    //w-32
}

const srcImg = computed(() => {
    if (props.cell.isRevealed){
        return `/img/${props.cell.value}.png`
    }else{
        return `/img/semFace.png`
    }
})
</script>

<template>
    <div class="grow" :class="{'opacity-25': cell.isMatched}">
        <img :src="srcImg" alt="Tictactoe piece" @click="clicked" class="w-32"> 
    </div>
</template>