export default function EndPage({ page }) {
  return (
    <div className="page__body">
      <span className="end-mark">§</span>
      <p>{page.byline || 'End of feature'}</p>
      <p>
        {page.templateName} · {page.wordCount.toLocaleString()} words
      </p>
    </div>
  );
}
