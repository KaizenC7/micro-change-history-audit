const normalize = (text) => {
  if (!text) return [];
  // split on whitespace and punctuation, keep words with letters/numbers
  return text
    .split(/\s+|(?=[,.!?;:\-()])|(?<=['".,!?;:\-()])/)
    .map(w => w.trim())
    .filter(Boolean)
    .map(w => w.toLowerCase());
};

const toFreq = (arr) => {
  const freq = new Map();
  for (const w of arr) freq.set(w, (freq.get(w) || 0) + 1);
  return freq;
};

// returns { addedWords: [], removedWords: [], addedCount, removedCount }
function diffTexts(oldText = "", newText = "") {
  const oldWords = normalize(oldText);
  const newWords = normalize(newText);

  const oldF = toFreq(oldWords);
  const newF = toFreq(newWords);

  const addedWords = [];
  const removedWords = [];
  let addedCount = 0;
  let removedCount = 0;

  // check words in newF compared to oldF
  for (const [w, newC] of newF.entries()) {
    const oldC = oldF.get(w) || 0;
    if (newC > oldC) {
      const delta = newC - oldC;
      addedCount += delta;
      addedWords.push({ word: w, count: delta });
    }
  }

  // check words removed
  for (const [w, oldC] of oldF.entries()) {
    const newC = newF.get(w) || 0;
    if (oldC > newC) {
      const delta = oldC - newC;
      removedCount += delta;
      removedWords.push({ word: w, count: delta });
    }
  }

  // sort by count desc (optional but nicer)
  addedWords.sort((a, b) => b.count - a.count);
  removedWords.sort((a, b) => b.count - a.count);

  return { addedWords, removedWords, addedCount, removedCount };
}

module.exports = { diffTexts };