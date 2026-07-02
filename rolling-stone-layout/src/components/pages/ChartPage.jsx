function BarChart({ data }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div className="bar-chart__bar" key={i}>
          <span className="bar-chart__value">{d.display}</span>
          <div
            className="bar-chart__fill"
            style={{ height: `${Math.max(6, (Math.abs(d.value) / max) * 100)}%` }}
          />
          <span className="bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatCards({ data }) {
  return (
    <div className="stat-cards">
      {data.map((d, i) => (
        <div className="stat-card" key={i}>
          <span className="stat-card__value">{d.display}</span>
          <p className="stat-card__caption">{d.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default function ChartPage({ page }) {
  const { chart } = page;
  return (
    <div className="page__body">
      <h2 className="chart-title">{chart.title}</h2>
      <p className="chart-caption">{chart.reason}</p>
      {chart.type === 'bar' ? <BarChart data={chart.data} /> : <StatCards data={chart.data} />}
      {chart.sourceText && <p className="chart-caption">Source line: “{chart.sourceText}”</p>}
    </div>
  );
}
