export default function ResultCard({ result }) {
  const chartLabel = result.chartType === 'garment' ? 'Garment chart' : 'Body chart';
  const confidenceClass = result.confidence || 'medium';

  return (
    <article className="card result-card">
      <div className="card-top">
        <h3 className="brand">{result.brand}</h3>
        <span className={`badge ${confidenceClass}`} aria-label={`${confidenceClass} confidence`}>
          {confidenceClass}
        </span>
      </div>
      <div className="size" aria-label={`Size ${result.size}`}>
        {result.size}
      </div>
      {result.note ? <p className="note">{result.note}</p> : null}
      <div className="type">{chartLabel}</div>
    </article>
  );
}
