export default {
  check,
  lookup
};

var elements;
var symbols = {};

await loadPeriodicTable();

// ****************************

async function loadPeriodicTable() {
  elements = await (await fetch('periodic-table.json')).json();
  for (let element of elements) {
    symbols[element.symbol.toLowerCase()] = element;
  }
}

function findCandidates(inputWord) {
  const oneLetterSymbols = [];
  const twoLetterSymbols = [];

  for (let i = 0; i < inputWord.length; i++) {
    const oneLetter = inputWord[i];

    // Collect all one letter symbols
    if (oneLetterSymbols.includes(oneLetter)) continue;
    if (oneLetter in symbols) {
      oneLetterSymbols.push(oneLetter);
    }

    if (i > inputWord.length - 2) continue;

    // Collect all two letter symbols
    const twoLetter = inputWord.slice(i, i + 2);

    if (twoLetterSymbols.includes(twoLetter)) continue;
    if (twoLetter in symbols) {
      twoLetterSymbols.push(twoLetter);
    }
  }

  return [...twoLetterSymbols, ...oneLetterSymbols];
}

function spellWord(candidates, charsLeft) {
  // Base Case
  if (charsLeft.length === 0) return [];

  // Recursive Case
  if (charsLeft.length >= 2) {
    const two = charsLeft.slice(0, 2);
    const rest = charsLeft.slice(2);

    if (candidates.includes(two)) {
      if (rest.length > 0) {
        const result = [two, ...spellWord(candidates, rest)];
        if (result.join('') === charsLeft) {
          return result;
        }
      } else {
        return [two];
      }
    }
  }

  // Now check for one letter symbols
  if (charsLeft.length >= 1) {
    const one = charsLeft[0];
    const rest = charsLeft.slice(1);

    if (candidates.includes(one)) {
      if (rest.length > 0) {
        const result = [one, ...spellWord(candidates, rest)];
        if (result.join('') === charsLeft) {
          return result;
        }
      } else {
        return [one];
      }
    }
  }
}

function check(inputWord) {
  const candidates = findCandidates(inputWord);
  return spellWord(candidates, inputWord);
}

function lookup(elementSymbol) {
  return symbols[elementSymbol];
}
