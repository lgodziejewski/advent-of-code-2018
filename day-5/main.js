const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
  
  const parsedInput = input[0];
  // const parsedInput = 'abfgcCGbBFa';
    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(input);
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
      // remove chars at index i and i - 1, start from beginnings
      const removeMe = prevChar + char;
      currentText = currentText.replace(removeMe, '');
      i = 1;
    }
  }

  return currentText.length;
}

function calculateSecondTask(input) {

}
