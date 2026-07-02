function stripQuotes(text) {
  return text.replace(/^["“”]+|["“”]+$/g, '');
}

export default function RecommendationsPanel({
  doc,
  template,
  quoteCandidates,
  featuredQuoteIds,
  onToggleQuote,
  chartRecs,
  chartEnabled,
  onToggleChart,
  pageCount,
}) {
  return (
    <div className="panel-section">
      <h3>Design recommendations</h3>

      <div className="rec-card">
        <span className="rec-label">Layout template</span>
        <strong>{template.name}</strong>
        <p className="panel-hint">{template.reason}</p>
      </div>

      <div className="rec-card">
        <span className="rec-label">Copy analysis</span>
        <ul className="stat-list">
          <li>{doc.wordCount.toLocaleString()} words</li>
          <li>{pageCount} laid-out pages</li>
          <li>{doc.blocks.filter((b) => b.type === 'p').length} body paragraphs</li>
        </ul>
      </div>

      <div className="rec-card">
        <span className="rec-label">Pull quotes ({featuredQuoteIds.size} featured)</span>
        <p className="panel-hint">Toggle which lines get pulled into oversized editorial type.</p>
        <ul className="quote-list">
          {quoteCandidates.map((q, i) => (
            <li key={i}>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={featuredQuoteIds.has(i)}
                  onChange={() => onToggleQuote(i)}
                />
                <span>&ldquo;{stripQuotes(q.text)}&rdquo;</span>
              </label>
            </li>
          ))}
          {quoteCandidates.length === 0 && <li className="panel-hint">No strong quotes detected yet.</li>}
        </ul>
      </div>

      <div className="rec-card">
        <span className="rec-label">Charts &amp; data</span>
        {chartRecs.length === 0 && <p className="panel-hint">No numeric statements detected in this draft.</p>}
        {chartRecs.map((rec, i) => (
          <div key={i} className="chart-rec">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={i === 0 && chartEnabled}
                onChange={onToggleChart}
                disabled={i !== 0}
              />
              <strong>{rec.title}</strong>
            </label>
            <p className="panel-hint">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
