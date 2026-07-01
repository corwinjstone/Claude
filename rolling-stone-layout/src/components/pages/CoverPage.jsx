export default function CoverPage({ page }) {
  return (
    <div className="page__body">
      <div className="cover-hero">
        <span className="cover-kicker">{page.kicker}</span>
      </div>
      <div className="cover-text">
        <h1 className="cover-headline">{page.headline}</h1>
        {page.dek && <p className="cover-dek">{page.dek}</p>}
        {page.byline && <div className="cover-byline">{page.byline}</div>}
      </div>
    </div>
  );
}
