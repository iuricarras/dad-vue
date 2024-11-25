import { ref } from 'vue'

export function useMemoryGame() {

    const status = ref(null)

    let board = ref([])
    const numRows = ref(3)
    const numCols = ref(4)
    let numPars = 0;

    let startTime = 0
    const gameTimer = ref(0)
    const gameTime = ref(0)


    let numMoves = 0;
    let firstCard = null
    let matched = ref(false)

    const shuffle = (array) => {
        let currentIndex = array.length

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
    }
    var id = null;
    const timer = () => {
        startTime = Date.now();
        if (id) {
            clearInterval(id);
            startTime = 0;
            gameTimer.value = 0;
            id = null;
            return
        }
        id = setInterval(function () {
            status.value = 2
            var delta = Date.now() - startTime
            gameTimer.value = delta / 1000
        }, 100)
    }

    const start = () => {

        status.value = null
        gameTime.value = 0

        clearInterval(id);
        startTime = 0;
        gameTimer.value = 0;
        id = null;

        board.value = []

        let allCards = []
        let cards = []
        
        numPars = numRows.value * numCols.value / 2

        for (let i = 1; i <= 40; i++) {
            allCards.push(i)
        }
        
        shuffle(allCards)

        for (let i = 1; i <= numPars; i++) {
            cards.push(allCards[i])
            cards.push(allCards[i])
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

        for (let i = 0; i < numRows.value * numCols.value; i++) {
            board.value.push({
                value: cards[i],
                isRevealed: false,
                isMatched: false
            })

        }


        console.log(board.value)
    }

    const move = (card) => {
        if (gameTimer.value == 0) {
            timer()
        }
        if (!firstCard) {
            firstCard = card
            card.isRevealed = true
        } else {
            card.isRevealed = true
            matched.value = true
            if (firstCard.value === card.value) {
                setTimeout(() => {
                    numPars--; 
                    firstCard.isMatched = true
                    card.isMatched = true
                    firstCard = null
                    matched.value = false

                    if (numPars == 0) {
                        status.value = 1
                        gameTime.value = (Date.now() - startTime) / 1000
                        timer()
                    }

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


    return { status, board, matched, gameTimer, gameTime, numCols, numRows, start, move }
}
