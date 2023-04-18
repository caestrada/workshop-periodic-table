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

function check(inputWord) {
  if (inputWord.length == 0) {
    return [];
  }

  // check every element for a symbol matching the next
  // 1-2 characters of the input word
  for (let element of elements) {
    let symbol = element.symbol.toLowerCase();
    if (symbol.length <= inputWord.length) {
      if (inputWord.slice(0, symbol.length) == symbol) {
        // more characters in the input word to try
        // to match to symbols?
        if (inputWord.length > symbol.length) {
          // recurse to check the remainder of the
          // input word
          let res = check(inputWord.slice(symbol.length));

          // was the check successful?
          if (res.length > 0) {
            return [symbol, ...res];
          }
        } else {
          return [symbol];
        }
      }
    }
  }

  return [];
}

function lookup(elementSymbol) {
  return symbols[elementSymbol];
}
