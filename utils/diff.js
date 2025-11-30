export function diffWords(oldText = "", newText = "") {
  const normalize = (text) => {
    if (!text) return [];
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

  const oldWords = normalize(oldText);
  const newWords = normalize(newText);

  const oldF = toFreq(oldWords);
  const newF = toFreq(newWords);

  const addedWords = [];
  const removedWords = [];
  let addedCount = 0;
  let removedCount = 0;

  for (const [w, newC] of newF.entries()) {
    const oldC = oldF.get(w) || 0;
    if (newC > oldC) {
      const delta = newC - oldC;
      addedCount += delta;
      addedWords.push({ word: w, count: delta });
    }
  }

  for (const [w, oldC] of oldF.entries()) {
    const newC = newF.get(w) || 0;
    if (oldC > newC) {
      const delta = oldC - newC;
      removedCount += delta;
      removedWords.push({ word: w, count: delta });
    }
  }

  addedWords.sort((a, b) => b.count - a.count);
  removedWords.sort((a, b) => b.count - a.count);

  return { addedWords, removedWords, addedCount, removedCount };
}
