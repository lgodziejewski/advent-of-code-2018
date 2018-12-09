const { fileToArray } = require('../fileToArray');
const dir = __dirname;

const testInputs = [
    { players: 9, last: 25, score: 32 },
    { players: 10, last: 1618, score: 8317 },
    { players: 13, last: 7999, score: 146373 },
    { players: 17, last: 1104, score: 2764 },
    { players: 21, last: 6111, score: 54718 },
    { players: 30, last: 5807, score: 37305 },
];

const myInput = {
    players: 411,
    last: 71170,
};


const myInputTwo = {
    players: 411,
    last: 7117000,
};

fileToArray(dir, 'input').then(input => {

    const firstResult = calculateFirstTask(myInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateFirstTask(myInputTwo);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    return myInputTwo;
}

function calculateFirstTask(data) {
    const firstElement = {
        value: 0,
    };
    firstElement.next = firstElement;
    firstElement.prev = firstElement;
    
    let currentMarble = firstElement;
    const magicNumber = 23;
    
    let currentPlayer = 1;
    const playerScores = {};
    // console.log('[-]: (0)');

    for (let marbleValue = 1; marbleValue <= data.last; marbleValue++) {

        if (marbleValue % magicNumber === 0) {
            /*
            - add current marble to current player score
            - remove marble 7 position to the left and add to player score
            - make the next marble (i.e. 6 position to the left) the current one
            */
           if (!playerScores[currentPlayer]) playerScores[currentPlayer] = 0;

           playerScores[currentPlayer] += marbleValue;

           
           // set new current
           for (let i = 0; i < 6; i++) {
                currentMarble = currentMarble.prev;
           }

           // remove previous element
           const removedMarble = currentMarble.prev;
           removedMarble.prev.next = currentMarble;
           currentMarble.prev = removedMarble.prev;

           playerScores[currentPlayer] += removedMarble.value;
        } else {
            // add value two position to the right of current one
            const nextElement = currentMarble.next;
            const newElement = {
                value: marbleValue,
                prev: nextElement,
                next: nextElement.next,
            };
            // console.log({ newElement });
            nextElement.next.prev = newElement;
            nextElement.next = newElement;
            
            currentMarble = newElement;
        }
        
        // const currentStateString = stateToString(firstElement, currentMarble);
        // console.log(`[${currentPlayer}]: ${currentStateString}`);

        currentPlayer++;
        if (currentPlayer > data.players) currentPlayer = 1;
    }

    // console.log('playerScores: ', playerScores);
    // find max score:
    const scores = Object.keys(playerScores).map(id => ({
        id,
        score: playerScores[id],
    })).sort((a, b) => b.score - a.score);

    // console.log(scores);
    const max = scores[0].score;

    return max;
}

function stateToString(firstElement, current) {
    let result = [];
    let pointer = firstElement;

    do {
        if (pointer === current) {
            result.push(`(${pointer.value})`);
        } else {
            result.push(pointer.value);
        }

        pointer = pointer.next;
    } while (pointer !== firstElement);
    
    return result.join(' ');
}

function calculateSecondTask(data) {

}
