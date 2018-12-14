const myInput = {
    recipes: 157901,
    score: 'nope',
};

const testInput1 = {
    recipes: 9,
    score: '5158916779',
};

const testInput2 = {
    recipes: 5,
    score: '0124515891',
};

const testInput3 = {
    recipes: 18,
    score: '9251071085',
}

const testInput4 = {
    recipes: 2018,
    score: '5941429882',
}

const offset = 10;
const currentInput = myInput;

main();

function main() {
    const state = [3, 7];
    let firstElf = 0;
    let secondElf = 1;
    // printState(state, firstElf, secondElf);

    while(state.length < (currentInput.recipes + offset)) {
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

        // printState(state, firstElf, secondElf);
    }

    // get score:
    const score = state.slice(currentInput.recipes, currentInput.recipes + offset).join('');

    console.log('calculated score: ', score);
    console.log('expected: ', currentInput.score);
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

