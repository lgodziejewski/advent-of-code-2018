const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);
    // console.log(JSON.stringify(parsedInput, null, 2));

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    const numbers = input[0].split(' ');
    const result = parseElement(numbers);

    return result;
}

function parseElement(numbers) {
    const childCount = +numbers.shift();
    const metaCount = +numbers.shift();

    const children = [];
    for (let i = 0; i < childCount; i++) {
        children.push(parseElement(numbers));
    }

    const meta = [];
    for (let i = 0; i < metaCount; i++) {
        meta.push(+numbers.shift());
    }

    return {
        childCount,
        metaCount,
        children,
        meta,
    };
}

function calculateFirstTask(data) {
    return getMetadataSum(data);
}

function getMetadataSum(element) {
    let sum = 0;
    sum += element.children.reduce((acc, child) => acc + getMetadataSum(child), 0);

    sum += element.meta.reduce((acc, e) => acc + e, 0);

    return sum;
}

function calculateSecondTask(data) {

}
