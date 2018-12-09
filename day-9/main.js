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

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    return myInput;
}

function calculateFirstTask(data) {
    const marbles = [0];
    const magicNumber = 23;
    let currentMarbleIndex = 0;
    let currentMarbleValue = 1;
    let currentPlayer = 1;
    const playerScores = {};
    // console.log('[-]: (0)');

    while (currentMarbleValue <= data.last) {
        if (currentMarbleValue % magicNumber === 0) {
            /*
            - add current marble to current player score
            - remove marble 7 position to the left and add to player score
            - make the next marble (i.e. 6 position to the left) the current one
            */
           if (!playerScores[currentPlayer]) playerScores[currentPlayer] = 0;

           playerScores[currentPlayer] += currentMarbleValue;

           let removedMarbleIndex = currentMarbleIndex - 7;
           while (removedMarbleIndex < 0) {
               removedMarbleIndex = marbles.length + removedMarbleIndex;
           }
           const [removedMarble] = marbles.splice(removedMarbleIndex, 1);
           playerScores[currentPlayer] += removedMarble;

           currentMarbleIndex = removedMarbleIndex;
        } else {
            // add value two position to the right of current one
            // if (marbles.length < )
            let newIndex = currentMarbleIndex + 2;
            while (newIndex > marbles.length) {
                newIndex = newIndex - marbles.length;
            }
            currentMarbleIndex = newIndex;

            marbles.splice(newIndex, 0, currentMarbleValue);
        }
        
        const currentStateString = stateToString(marbles, currentMarbleIndex);
        // console.log(`[${currentPlayer}]: ${currentStateString}`);

        currentMarbleValue++;
        currentPlayer++;
        if (currentPlayer > data.players) currentPlayer = 1;

        // if (marbles.length > 20) break;
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

function stateToString(data, currentIndex) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        if (i === currentIndex) {
            result.push(`(${data[i]})`);
        } else {
            result.push(data[i]);
        }
    }
    return result.join(' ');
}

function calculateSecondTask(data) {

}
