import { ref } from 'vue'

export function useMemoryGame() {

    const status = ref(null)

    let board = ref([])
    const numRows = 2
    const numCol = 6

    let firstCard = null
    let matched = ref(false)

    const shuffle = (array) => {
        let currentIndex = array.length;

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    const start = () => {

        status.value = null

        let cards = []

        let numCards = numRows * numCol / 2

        for (let i = 1; i <= numCards; i++) {
            cards.push(i)
            cards.push(i)
        }

        shuffle(cards)

        // for(let i = 0; i < numRows; i++){
        //     let row = []
        //     for(let j = 0; j < numCol; j++){
        //         row.push({
        //             value: cards[i * numCol + j],
        //             isRevealed: false,
        //             isMatched: false
        //         })
        //     }
        //     board.value.push(row)
        // }

        for (let i = 0; i < numRows * numCol; i++) {
            board.value.push({
                value: cards[i],
                isRevealed: false,
                isMatched: false
            })

        }


        console.log(board.value)
    }

    const move = (card) => {
        if (!firstCard) {
            firstCard = card
            card.isRevealed = true
        } else {
            card.isRevealed = true
            matched.value = true
            if (firstCard.value === card.value) {
                setTimeout(() => {
                    firstCard.isMatched = true
                    card.isMatched = true
                    firstCard = null
                    matched.value = false
                }, 1000)
            } else {
                setTimeout(() => {
                    firstCard.isRevealed = false
                    card.isRevealed = false
                    firstCard = null
                    matched.value = false
                }, 1000)
            }
        }
    }


    return { status, board, matched ,start, move }
}
