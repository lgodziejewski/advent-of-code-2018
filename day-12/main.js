const { fileToArray } = require('../fileToArray');
const dir = __dirname;

const testData = {
    initialState: '#..#.#..##......###...###',
    inputFile: 'test',
};
const properData = {
    initialState: '#.#####.##.###...#...#.####..#..#.#....##.###.##...#####.#..##.#..##..#..#.#.#.#....#.####....#..#',
    inputFile: 'input',
};

const useData = properData;

const plant = '#';
const pot = '.';

fileToArray(dir, useData.inputFile).then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    const initialState = useData.initialState.split('').map((char, id) => ({ id, char }));

    const margin = 60;
    let extendedFirstState = [];
    for (let i = -margin; i < 0; i++) {
        extendedFirstState.push({ id: i, char: pot });
    }
    extendedFirstState = [...extendedFirstState, ...initialState];
    for (let i = initialState.length; i < initialState.length + 2; i++) {
        extendedFirstState.push({ id: i, char: pot });
    }


    const RULE_RE = /([.#]{5}) => ([.#])/;
    const rules = input.reduce((acc, row) => {
        const [_, key, value] = RULE_RE.exec(row);

        acc[key] = value;

        return acc;
    }, {});

    return { firstState: extendedFirstState, rules };
}

function calculateFirstTask(data) {
    let currentState = data.firstState;
    const rules = data.rules;
    const offset = 60;
    const maxIteration = 20;
    // const maxIteration = 20;

    for (let iteration = 1; iteration <= maxIteration; iteration++) {
        const newState = [];

        // iterate over "normal" elements
        for (let i = 0; i < currentState.length + 2; i++) {
            if (i < 5) {
                newState.push(currentState[i]);
            } else {
                const key = getState(currentState, i);

                const char = rules[key] || '.';
                newState.push({ id: i - offset, char });
            }
        }

        // console.log({ iteration, newState });
        currentState = newState;
        // console.log(currentState.map(el => el.char).join(''));
    }

    const result = currentState.filter(el => el.char === plant).reduce((acc, el) => acc + el.id, 0);

    return result;
}

function getState(data, idx) {
    const pots = [];

    for (let i = idx - 2; i < idx + 3; i++) {
        const element = data[i];
        pots.push(element ? element.char : pot);
    }

    return pots.join('');
}

function calculateSecondTask(data) {

}
