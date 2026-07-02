export default function QuoteSpread({ page }) {
  const text = page.quote.text.replace(/^["“]|["”]$/g, '');
  return (
    <div className="page__body">
      <div className="quote-spread">
        <span className="quote-mark">“</span>
        <blockquote>{text}</blockquote>
        {page.quote.speaker && <div className="quote-attribution">{page.quote.speaker}</div>}
      </div>
    </div>
  );
}
