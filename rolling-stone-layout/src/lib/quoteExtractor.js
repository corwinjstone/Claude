// Scores sentences pulled from the manuscript body for how well they'd work
// as a big editorial pull quote, the way a magazine copy editor would circle
// the punchiest line on a printout.

const VIVID_WORDS = [
  'never', 'always', 'nobody', 'everybody', 'everything', 'nothing', 'die', 'dead',
  'love', 'hate', 'fear', 'crazy', 'insane', 'broken', 'raw', 'truth', 'lie', 'lied',
  'freedom', 'power', 'money', 'fame', 'alone', 'war', 'fight', 'dream', 'legend',
  'destroy', 'survive', 'believe', 'remember', 'forever', 'silence', 'chaos',
];

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);
}

function scoreSentence(s) {
  const len = s.length;
  let score = 0;

  // Ideal pull-quote length is a tight band — long enough to say something,
  // short enough to set in 48pt type without wrapping five lines.
  const ideal = 90;
  score += Math.max(0, 40 - Math.abs(len - ideal) / 2);

  if (/["“”]/.test(s)) score += 12;
  if (/!$/.test(s)) score += 8;
  if (/\b(I|we|you)\b/i.test(s)) score += 6;
  if (/[:—-]/.test(s)) score += 3;

  const lower = s.toLowerCase();
  for (const w of VIVID_WORDS) {
    if (lower.includes(w)) score += 5;
  }

  if (len < 30) score -= 20;
  if (len > 220) score -= 30;
  if (/^(and|but|so|or|because)\b/i.test(s)) score -= 6;

  return score;
}

/**
 * @param {object} doc parsed manuscript document
 * @param {number} count how many pull quotes to return
 */
export function extractPullQuotes(doc, count = 6) {
  const candidates = [];

  doc.blocks.forEach((block, blockIndex) => {
    if (block.type === 'quote') {
      candidates.push({
        text: block.text,
        score: block.forced ? 999 : scoreSentence(block.text),
        blockIndex,
      });
    } else if (block.type === 'p') {
      for (const sentence of splitSentences(block.text)) {
        candidates.push({ text: sentence.trim(), score: scoreSentence(sentence), blockIndex });
      }
    } else if (block.type === 'dialogue') {
      for (const line of block.lines) {
        for (const sentence of splitSentences(line.text)) {
          candidates.push({
            text: sentence.trim(),
            score: scoreSentence(sentence) + 4,
            blockIndex,
            speaker: line.speaker,
          });
        }
      }
    }
  });

  candidates.sort((a, b) => b.score - a.score);

  // Prefer spreading quotes across different source paragraphs so the whole
  // spread doesn't get its pulls from one clump of text.
  const seenBlocks = new Set();
  const picked = [];
  for (const c of candidates) {
    if (picked.length >= count) break;
    if (seenBlocks.has(c.blockIndex) && picked.length < candidates.length) {
      continue;
    }
    picked.push(c);
    seenBlocks.add(c.blockIndex);
  }
  // Backfill if spreading left us short.
  if (picked.length < count) {
    for (const c of candidates) {
      if (picked.length >= count) break;
      if (!picked.includes(c)) picked.push(c);
    }
  }

  return picked;
}
