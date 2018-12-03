const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const firstResult = calculateFirstTask(input);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(input);
    console.log('second result: ', secondResult);
});

function calculateFirstTask(input) {
    let twoSameLetterIDCount = 0;
    let threeSameLetterIDCount = 0;

    input.forEach(word => {
        const letters = countLetters(word);
        
        const results = hasTwoOrThreeSameLetters(letters);
        if (results.two) twoSameLetterIDCount++;
        if (results.three) threeSameLetterIDCount++;
    });

    return twoSameLetterIDCount * threeSameLetterIDCount;
}

function calculateSecondTask(input) {

}

function countLetters(word) {
    const result = {};
    word.split('').forEach(letter => {
        if (result[letter]) result[letter]++;
        else result[letter] = 1;
    });

    return result;
}

function hasTwoOrThreeSameLetters(letters) {
    const res = { two: false, three: false };

    Object.keys(letters).forEach(letter => {
        if (letters[letter] === 2) res.two = true;
        if (letters[letter] === 3) res.three = true;
    });

    return res;
}
