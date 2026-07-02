export default function CountdownPage({ page }) {
  return (
    <div className="page__body">
      <h1 className="countdown-rank">#{page.rank}</h1>
      <span className="countdown-total">
        {page.rank} of {page.total}
      </span>
      <p className="countdown-text">{page.text}</p>
    </div>
  );
}
