// Parses a raw manuscript (plain text or lightly-marked-up) into a structured
// document the layout engine can reason about. No AI calls — pure heuristics,
// so the tool works instantly and offline on anything you paste in.

const WORD_RE = /[A-Za-z0-9'’]+/g;

function countWords(text) {
  return (text.match(WORD_RE) || []).length;
}

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);
}

function isListLine(line) {
  return /^\s*(?:[-*•]|\d+[.)])\s+/.test(line);
}

function stripListMarker(line) {
  return line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim();
}

function isHeadingLine(line) {
  return /^#{1,3}\s+/.test(line);
}

function stripHeadingMarker(line) {
  return line.replace(/^#{1,3}\s+/, '').trim();
}

function isBlockquoteLine(line) {
  return /^>\s+/.test(line);
}

function stripBlockquoteMarker(line) {
  return line.replace(/^>\s+/, '').trim();
}

function isBylineLine(line) {
  return /^(by|words by|story by|as told to)\s+/i.test(line.trim());
}

function isDialogueLine(line) {
  // "Q: ..." / "A: ..." / "Interviewer: ..." / "NAME: ..." style exchange
  return /^[A-Z][A-Za-z .'’-]{0,28}:\s+\S/.test(line.trim());
}

/**
 * @param {string} raw
 * @returns {object} structured document model
 */
export function parseManuscript(raw) {
  const text = (raw || '').replace(/\r\n?/g, '\n').trim();

  if (!text) {
    return {
      kicker: '',
      headline: 'Untitled Manuscript',
      dek: '',
      byline: '',
      blocks: [],
      wordCount: 0,
      flags: { isInterview: false, isListicle: false, hasStats: false },
      statCandidates: [],
    };
  }

  const rawLines = text.split('\n');
  // Collapse to logical lines, keeping blank lines as paragraph separators.
  const lines = rawLines.map((l) => l.trim());

  let i = 0;
  let kicker = '';
  let headline = '';
  let byline = '';
  let dek = '';

  // Skip leading blank lines.
  while (i < lines.length && lines[i] === '') i++;

  // Optional kicker line in [brackets] or ALL CAPS short line right before headline.
  if (i < lines.length && /^\[.+\]$/.test(lines[i])) {
    kicker = lines[i].replace(/^\[|\]$/g, '').trim();
    i++;
    while (i < lines.length && lines[i] === '') i++;
  }

  if (i < lines.length) {
    headline = stripHeadingMarker(lines[i]).replace(/^["“]|["”]$/g, '');
    i++;
  }
  while (i < lines.length && lines[i] === '') i++;

  if (i < lines.length && isBylineLine(lines[i])) {
    byline = lines[i];
    i++;
    while (i < lines.length && lines[i] === '') i++;
  }

  // A short, single-line summary before the first real paragraph reads as a dek.
  if (
    i < lines.length &&
    lines[i] !== '' &&
    !isListLine(lines[i]) &&
    !isHeadingLine(lines[i]) &&
    !isDialogueLine(lines[i]) &&
    lines[i].length <= 220 &&
    (i + 1 >= lines.length || lines[i + 1] === '' || countWords(lines[i]) < 40)
  ) {
    const next = lines[i + 1] ?? '';
    const after = lines[i + 2] ?? '';
    // Only treat as a dek if it's clearly its own short paragraph (blank line follows).
    if (next === '' && after !== '' && countWords(lines[i]) <= 55) {
      dek = lines[i];
      i++;
      while (i < lines.length && lines[i] === '') i++;
    }
  }

  if (!byline) {
    // byline sometimes trails the dek instead of leading it
    if (i < lines.length && isBylineLine(lines[i])) {
      byline = lines[i];
      i++;
      while (i < lines.length && lines[i] === '') i++;
    }
  }

  // Remaining lines -> body blocks
  const bodyLines = lines.slice(i);
  const blocks = [];
  let para = [];
  let listItems = [];
  let dialogueLines = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ').trim() });
      para = [];
    }
  };
  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems.slice() });
      listItems = [];
    }
  };
  const flushDialogue = () => {
    if (dialogueLines.length) {
      blocks.push({ type: 'dialogue', lines: dialogueLines.slice() });
      dialogueLines = [];
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushDialogue();
  };

  for (const line of bodyLines) {
    if (line === '') {
      flushAll();
      continue;
    }
    if (isHeadingLine(line)) {
      flushAll();
      blocks.push({ type: 'h2', text: stripHeadingMarker(line) });
    } else if (isBlockquoteLine(line)) {
      flushAll();
      blocks.push({ type: 'quote', text: stripBlockquoteMarker(line), forced: true });
    } else if (isListLine(line)) {
      flushPara();
      flushDialogue();
      listItems.push(stripListMarker(line));
    } else if (isDialogueLine(line)) {
      flushPara();
      flushList();
      const idx = line.indexOf(':');
      dialogueLines.push({ speaker: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim() });
    } else {
      flushList();
      flushDialogue();
      para.push(line);
    }
  }
  flushAll();

  const bodyText = blocks
    .filter((b) => b.type === 'p' || b.type === 'quote')
    .map((b) => b.text)
    .join(' ');
  const wordCount = countWords([headline, dek, bodyText].join(' '));

  const dialogueBlockCount = blocks.filter((b) => b.type === 'dialogue').length;
  const listBlockCount = blocks.filter((b) => b.type === 'list').length;
  const listItemCount = blocks
    .filter((b) => b.type === 'list')
    .reduce((n, b) => n + b.items.length, 0);

  const statCandidates = extractStatSentences(bodyText);

  const flags = {
    isInterview: dialogueBlockCount >= 1 && dialogueLinesTotal(blocks) >= 4,
    isListicle: listItemCount >= 3 && listBlockCount >= 1,
    hasStats: statCandidates.length >= 2,
  };

  return { kicker, headline, dek, byline, blocks, wordCount, flags, statCandidates };
}

function dialogueLinesTotal(blocks) {
  return blocks.filter((b) => b.type === 'dialogue').reduce((n, b) => n + b.lines.length, 0);
}

const NUMBER_RE = /(\$?\d[\d,]*(?:\.\d+)?\s?(?:%|percent|million|billion|thousand|k\b|x\b)?)/gi;

function extractStatSentences(bodyText) {
  const sentences = splitSentences(bodyText);
  const candidates = [];
  for (const s of sentences) {
    const matches = s.match(NUMBER_RE)?.filter((m) => /\d/.test(m)) || [];
    if (matches.length >= 1) {
      candidates.push({ text: s.trim(), numbers: matches.map(parseStatNumber).filter((n) => n.value !== null) });
    }
  }
  return candidates.filter((c) => c.numbers.length > 0);
}

function parseStatNumber(raw) {
  const cleaned = raw.replace(/,/g, '').trim();
  const m = cleaned.match(/^\$?(\d+(?:\.\d+)?)\s?(%|percent|million|billion|thousand|k|x)?$/i);
  if (!m) return { value: null, label: raw };
  let value = parseFloat(m[1]);
  const unit = (m[2] || '').toLowerCase();
  if (unit === 'billion') value *= 1000;
  if (unit === 'thousand' || unit === 'k') value /= 1000;
  return { value, label: raw.trim(), isPercent: unit === '%' || unit === 'percent', unit };
}
