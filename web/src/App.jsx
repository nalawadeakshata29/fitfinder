import { useState } from 'react';
import SizeForm from './components/SizeForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import { getRecommendations } from './api.js';

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(body) {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendations(body);
      setResults(data.results);
    } catch (err) {
      setResults(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>FitFinder</h1>
      <p className="subtitle">Enter your measurements to see your size in each brand. Women's tops only.</p>

      <SizeForm onSubmit={handleSubmit} loading={loading} />

      {error && <div className="error">{error}</div>}

      {results && (
        <>
          <h2>Your sizes</h2>
          <div className="grid">
            {results.map((r) => (
              <ResultCard key={r.slug} result={r} />
            ))}
          </div>
          <p className="disclaimer">
            Estimates based on public marketplace size charts. Garment charts are approximate, so check the brand's own guide before buying.
          </p>
        </>
      )}
    </main>
  );
}