const myInput = {
    recipes: 157901,
    score: 'nope',
    score2: '157901',
};

const testInput1 = {
    recipes: 9,
    score: '5158916779',
    score2: '51589',
};

const testInput2 = {
    recipes: 5,
    score: '0124515891',
    score2: '01245',
};

const testInput3 = {
    recipes: 18,
    score: '9251071085',
    score2: '92510',
}

const testInput4 = {
    recipes: 2018,
    score: '5941429882',
    score2: '59414',
}

const offset = 10;
const currentInput = myInput;

main();

function main() {
    const state = [3, 7];
    let firstElf = 0;
    let secondElf = 1;
    // printState(state, firstElf, secondElf);
    let resultTwo;
    const puzzleLength = currentInput.score2.length;
    let prevLength = 2;


    while(state.length < (currentInput.recipes + offset)) {
        // do step
        ({ firstElf, secondElf } = doStep(state, firstElf, secondElf));

        // printState(state, firstElf, secondElf);
        // check 2nd task sequence:
        if (!resultTwo && state.length > puzzleLength) {
            // if two digits were added, check two fragments
            if (state.length - prevLength === 2) {
                const fragment = state.slice(state.length - puzzleLength - 1, state.length - 1).join('');
                if (fragment === currentInput.score2) {
                    resultTwo = state.length - puzzleLength - 1;
                }
            }
            const fragment = state.slice(state.length - puzzleLength).join('');
            if (fragment === currentInput.score2) {
                resultTwo = state.length - puzzleLength;
            }
        }
        prevLength = state.length;
    }

    // get score:
    const score = state.slice(currentInput.recipes, currentInput.recipes + offset).join('');

    console.log('first task score: ', score);
    console.log('first task expected: ', currentInput.score);

    // 2nd task
    // check if sequence currently exists:
    while (!resultTwo) {
        ({ firstElf, secondElf } = doStep(state, firstElf, secondElf));

        // if two digits were added, check two fragments
        if (state.length - prevLength === 2) {
            const fragment = state.slice(state.length - puzzleLength - 1, state.length - 1).join('');
            if (fragment === currentInput.score2) {
                resultTwo = state.length - puzzleLength - 1;
            }
        }

        // check 2nd task sequence:
        const fragment = state.slice(state.length - puzzleLength).join('');
        if (fragment === currentInput.score2) {
            resultTwo = state.length - puzzleLength;
        }

        prevLength = state.length;
    }

    console.log('2nd task score: ', resultTwo);
    console.log('2nd task expected: ', currentInput.recipes);
}

function doStep(state, firstElf, secondElf) {
    // get current recipes:
    const firstRecipe = state[firstElf];
    const secondRecipe = state[secondElf];

    // create new recipe(s):
    const digits = (firstRecipe + secondRecipe).toString().split('').map(Number);

    // add to current state
    for (digit of digits) {
        state.push(digit);
    }

    // increment elf indexes:
    firstElf = (firstElf + firstRecipe + 1) % state.length;
    secondElf = (secondElf + secondRecipe + 1) % state.length;

    return { firstElf, secondElf };
}

function printState(state, firstElf, secondElf) {
    const result = [];

    for (let i = 0; i < state.length; i++) {
        const el = state[i];
        if (i === firstElf) result.push(`(${el})`);
        else if (i === secondElf) result.push(`[${el}]`);
        else result.push(el);
    }

    console.log(result.join(' '));
}

