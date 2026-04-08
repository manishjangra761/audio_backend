function compareTexts(originalText, typedText) {
  const originalWords = originalText.trim().split(/\s+/);
  const typedWords = typedText.trim().split(/\s+/);

  let result = [];

  const maxLength = Math.max(originalWords.length, typedWords.length);

  for (let i = 0; i < maxLength; i++) {
    const original = originalWords[i];
    const typed = typedWords[i];

    if (original === typed) {
      result.push(`<span style="color:#22c55e">${typed}</span>`);
    }

    else if (typed && original && typed !== original) {
      result.push(
        `<span style="color:#ef4444;text-decoration:line-through">${typed}</span> <span style="color:#22c55e">${original}</span>`
      );
    }

    else if (!typed && original) {
      result.push(`<span style="color:#3b82f6">${original}</span>`);
    }

    else if (typed && !original) {
      result.push(`<span style="color:#ef4444;text-decoration:line-through">${typed}</span>`);
    }
  }

  return result.join(" ");
}

exports.compareTexts = compareTexts;