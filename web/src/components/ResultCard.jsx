export default function ResultCard({ result }) {
  return (
    <div className="card">
      <div className="brand">{result.brand}</div>
      <div className="size">{result.size}</div>
      <span className={`badge ${result.confidence}`}>{result.confidence} confidence</span>
      {result.note && <div className="note">{result.note}</div>}
      <div className="type">{result.chartType === 'garment' ? 'Garment chart' : 'Body chart'}</div>
    </div>
  );
}