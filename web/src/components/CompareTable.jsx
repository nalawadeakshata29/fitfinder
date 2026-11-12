export default function CompareTable({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div
      className="table-wrapper"
      tabIndex={0}
      role="region"
      aria-label="Brand size comparison"
    >
      <table className="compare-table">
        <thead>
          <tr>
            <th scope="col">Brand</th>
            <th scope="col">Size</th>
            <th scope="col">Confidence</th>
            <th scope="col">Chart</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.slug || r.brand}>
              <td className="cell-brand">{r.brand}</td>
              <td className="cell-size">{r.size}</td>
              <td>
                <span className={`badge ${r.confidence || 'medium'}`}>
                  {r.confidence}
                </span>
              </td>
              <td>
                {r.chartType === 'garment' ? 'Garment chart' : 'Body chart'}
              </td>
              <td className="cell-note">{r.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

