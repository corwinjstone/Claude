// Decides which editorial template fits the manuscript, then flows the
// parsed content into discrete magazine pages/spreads — the way a layout
// editor would cast off copy across a feature well.

const WORD_RE = /[A-Za-z0-9'’]+/g;
const countWords = (text) => (text.match(WORD_RE) || []).length;

const TEMPLATES = {
  interview: {
    id: 'interview',
    name: 'Q&A / Interview',
    section: 'THE INTERVIEW',
    wordBudget: 190,
  },
  listicle: {
    id: 'listicle',
    name: 'Ranked Countdown',
    section: 'THE LIST',
    wordBudget: 120,
  },
  review: {
    id: 'review',
    name: 'Capsule Review',
    section: 'REVIEWS',
    wordBudget: 220,
  },
  feature: {
    id: 'feature',
    name: 'Longform Feature',
    section: 'FEATURE',
    wordBudget: 250,
  },
};

export function chooseTemplate(doc) {
  if (doc.flags.isInterview) {
    return { ...TEMPLATES.interview, reason: 'Detected a back-and-forth Q&A / dialogue pattern in the manuscript.' };
  }
  if (doc.flags.isListicle) {
    return { ...TEMPLATES.listicle, reason: 'Detected a ranked or bulleted list structure — built as a countdown spread.' };
  }
  if (doc.wordCount > 0 && doc.wordCount <= 380) {
    return { ...TEMPLATES.review, reason: 'Short word count reads like a capsule review — compact, quote-forward layout.' };
  }
  return { ...TEMPLATES.feature, reason: 'Long-form narrative copy — laid out as a multi-page feature well with a drop cap opener.' };
}

function blockWordCount(block) {
  if (block.type === 'list') {
    return block.items.reduce((n, item) => n + countWords(item) + 2, 0);
  }
  if (block.type === 'dialogue') {
    return block.lines.reduce((n, l) => n + countWords(l.text) + 2, 0);
  }
  return countWords(block.text);
}

/**
 * Flows non-list, non-forced-quote blocks across article pages using a word
 * budget per page, starting a fresh page on section headings.
 */
function flowBlocks(blocks, wordBudget) {
  const pages = [];
  let current = [];
  let currentWords = 0;

  const pushPage = () => {
    if (current.length) {
      pages.push(current);
      current = [];
      currentWords = 0;
    }
  };

  blocks.forEach((block) => {
    const w = blockWordCount(block);
    if (block.type === 'h2' && current.length) {
      pushPage();
    }
    if (currentWords > 0 && currentWords + w > wordBudget) {
      pushPage();
    }
    current.push(block);
    currentWords += w;
  });
  pushPage();
  return pages;
}

/**
 * @param {object} doc parsed manuscript
 * @param {object} opts { template, featuredQuotes, chartRecs }
 */
export function buildPages(doc, opts) {
  const template = opts.template || chooseTemplate(doc);
  let featuredQuotes = opts.featuredQuotes || [];
  const chartRecs = opts.chartRecs || [];

  const pages = [];

  pages.push({
    type: 'cover',
    kicker: doc.kicker || template.section,
    headline: doc.headline,
    dek: doc.dek,
    byline: doc.byline,
  });

  if (template.id === 'listicle') {
    const introBlocks = [];
    const listBlocks = [];
    const outroBlocks = [];
    let seenList = false;
    doc.blocks.forEach((b) => {
      if (b.type === 'list') {
        seenList = true;
        listBlocks.push(b);
      } else if (b.type === 'quote' && b.forced) {
        // handled separately below
      } else if (!seenList) {
        introBlocks.push(b);
      } else {
        outroBlocks.push(b);
      }
    });

    flowBlocks(introBlocks, template.wordBudget).forEach((blockSet, idx) => {
      pages.push({ type: 'article', blocks: blockSet, dropCap: idx === 0, heading: null });
    });

    let rank = 1;
    listBlocks.forEach((lb) => {
      lb.items.forEach((item) => {
        pages.push({ type: 'countdown', rank, total: lb.items.length, text: item });
        rank += 1;
      });
    });

    flowBlocks(outroBlocks, template.wordBudget).forEach((blockSet) => {
      pages.push({ type: 'article', blocks: blockSet, dropCap: false, heading: null });
    });

    const forcedQuotes = doc.blocks.filter((b) => b.type === 'quote' && b.forced);
    if (forcedQuotes.length) {
      pages.push({ type: 'quote-spread', quote: { text: forcedQuotes[0].text }, forced: true });
    }
  } else {
    const flowable = doc.blocks.filter((b) => !(b.type === 'quote' && b.forced));
    const forcedQuotes = doc.blocks.filter((b) => b.type === 'quote' && b.forced);
    const chunks = flowBlocks(flowable, template.wordBudget);

    let remainingFeatured = featuredQuotes;
    let inlineQuote = null;
    if (remainingFeatured.length && chunks.length > 1) {
      inlineQuote = remainingFeatured[0];
      remainingFeatured = remainingFeatured.slice(1);
    }

    chunks.forEach((blockSet, idx) => {
      pages.push({
        type: 'article',
        blocks: blockSet,
        dropCap: idx === 0,
        dialogue: template.id === 'interview',
        inlineQuote: idx === 1 ? inlineQuote : null,
      });
      // Weave in an author-marked blockquote right after the page it followed in the source.
      if (forcedQuotes.length && idx === 0) {
        pages.push({ type: 'quote-spread', quote: { text: forcedQuotes[0].text }, forced: true });
      }
    });
    featuredQuotes = remainingFeatured;
  }

  // Insert a chart page after the first interior page, if one is recommended.
  if (chartRecs.length) {
    const insertAt = Math.min(2, pages.length);
    pages.splice(insertAt, 0, { type: 'chart', chart: chartRecs[0] });
  }

  // Interleave remaining featured pull-quote spreads through the interior pages.
  if (featuredQuotes.length) {
    const interiorEnd = pages.length;
    const step = Math.max(2, Math.floor(interiorEnd / (featuredQuotes.length + 1)));
    let insertedOffset = 0;
    featuredQuotes.forEach((q, i) => {
      const pos = Math.min(pages.length - 1, step * (i + 1) + insertedOffset);
      pages.splice(pos, 0, { type: 'quote-spread', quote: q });
      insertedOffset += 1;
    });
  }

  pages.push({
    type: 'end',
    byline: doc.byline,
    wordCount: doc.wordCount,
    templateName: template.name,
  });

  return pages.map((p, idx) => ({
    ...p,
    id: `page-${idx}`,
    pageNumber: idx + 1,
    section: template.section,
  }));
}
