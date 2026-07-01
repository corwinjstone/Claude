// Looks at the numeric statements the parser pulled out of the manuscript and
// recommends how a designer would visualize them: a handful of isolated big
// numbers become oversized "stat cards," a real series becomes a bar chart.

function segmentLabel(segment, numberText) {
  const cleaned = segment.replace(numberText, '').replace(/^[,;:\s]+|[,;:\s]+$/g, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 4).join(' ');
  return words || 'Figure';
}

function cleanSentence(s) {
  return s.replace(/^[\s:;,."'”’]+/, '').trim();
}

function looksLikeYear(n) {
  return (
    !n.unit &&
    !n.isPercent &&
    !n.label.startsWith('$') &&
    Number.isInteger(n.value) &&
    n.value >= 1000 &&
    n.value <= 2100
  );
}

function formatValue(n) {
  if (n.isPercent) return `${n.value}%`;
  if (n.unit === 'million' || n.unit === 'billion' || n.unit === 'thousand' || n.unit === 'k') {
    return `${n.label}`;
  }
  return n.label.startsWith('$') ? n.label : `${n.value}`;
}

/**
 * @param {object} doc parsed manuscript document (needs doc.statCandidates)
 */
export function recommendCharts(doc) {
  const candidates = doc.statCandidates || [];
  if (candidates.length === 0) return [];

  const recs = [];

  // A single sentence carrying 3+ numbers is very likely a ready-made series
  // ("...25% in 2021, 41% in 2022, and 63% this year.").
  const seriesSentence = candidates.find((c) => c.numbers.length >= 3);
  if (seriesSentence) {
    const segments = seriesSentence.text.split(/,|\band\b/i).map((s) => s.trim()).filter(Boolean);
    const bars = [];
    seriesSentence.numbers.forEach((n, idx) => {
      const seg = segments.find((s) => s.includes(n.label)) || segments[idx] || seriesSentence.text;
      bars.push({ label: segmentLabel(seg, n.label), value: n.value, display: formatValue(n) });
    });
    recs.push({
      type: 'bar',
      title: 'Recommended: trend bar chart',
      reason: 'This sentence strings together a numeric series — chart it instead of burying it in a paragraph.',
      sourceText: cleanSentence(seriesSentence.text),
      data: bars,
    });
  }

  // Otherwise (or in addition, for a second recommendation), pull the
  // standout individual figures across the piece into big stat cards.
  const singles = candidates
    .filter((c) => c !== seriesSentence)
    .flatMap((c) => c.numbers.map((n) => ({ ...n, sourceText: cleanSentence(c.text) })))
    .filter((n) => n.value !== null && !looksLikeYear(n))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 4);

  if (singles.length >= 2) {
    recs.push({
      type: 'stat-cards',
      title: 'Recommended: pulled statistics',
      reason: 'Standalone figures like these read stronger as oversized callout numbers than inline text.',
      data: singles.map((n) => ({ display: formatValue(n), caption: n.sourceText })),
    });
  } else if (singles.length === 1 && recs.length === 0) {
    recs.push({
      type: 'stat-cards',
      title: 'Recommended: single callout figure',
      reason: 'One strong number in the piece — feature it as a full callout rather than a bar chart.',
      data: singles.map((n) => ({ display: formatValue(n), caption: n.sourceText })),
    });
  }

  return recs;
}
