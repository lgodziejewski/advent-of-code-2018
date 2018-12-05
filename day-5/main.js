const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
  
  const parsedInput = input[0];
  // const parsedInput = 'abfgcCGbBFa';
    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function calculateFirstTask(input) {
  let currentText = input;
  for (let i = 1; i < currentText.length; i++) {
    const char = currentText[i];
    const charIsLowerCase = char === char.toLowerCase();
    const prevChar = currentText[i - 1];
    const prevCharIsLowerCase = prevChar === prevChar.toLowerCase();
    if (
      (charIsLowerCase && !prevCharIsLowerCase && char === prevChar.toLowerCase())
      || (!charIsLowerCase && prevCharIsLowerCase && char.toLowerCase() === prevChar)
    ) {
      // remove chars at index i and i - 1
      const removeMe = prevChar + char;
      currentText = currentText.replace(removeMe, '');
      i = Math.max(i - 2, 0);
    }
  }

  return currentText.length;
}

function calculateSecondTask(input) {

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const result = {};

  for (letter of letters) {

    // remove all occurences of given letter
    const regex = new RegExp(letter, 'ig');
    let currentText = input.replace(regex, '');

    // react polymers
    for (let i = 1; i < currentText.length; i++) {
      const char = currentText[i];
      const charIsLowerCase = char === char.toLowerCase();
      const prevChar = currentText[i - 1];
      const prevCharIsLowerCase = prevChar === prevChar.toLowerCase();
      if (
        (charIsLowerCase && !prevCharIsLowerCase && char === prevChar.toLowerCase())
        || (!charIsLowerCase && prevCharIsLowerCase && char.toLowerCase() === prevChar)
      ) {
        // remove chars at index i and i - 1
        const removeMe = prevChar + char;
        currentText = currentText.replace(removeMe, '');
        i = Math.max(i - 2, 0);
      }
    }

    result[letter] = currentText.length;
  }

  return result;
}
