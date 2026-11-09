import { useState } from 'react';

export default function SizeForm({ onSubmit, loading }) {
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [fit, setFit] = useState('regular');

  function handleSubmit(e) {
    e.preventDefault();
    const body = { bust: Number(bust), fit };
    if (waist !== '') body.waist = Number(waist);
    if (hips !== '') body.hips = Number(hips);
    onSubmit(body);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Bust (cm) *
        <input type="number" step="0.1" value={bust} onChange={(e) => setBust(e.target.value)} placeholder="e.g. 89" required />
      </label>
      <label>
        Waist (cm)
        <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="optional" />
      </label>
      <label>
        Hips (cm)
        <input type="number" step="0.1" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="optional" />
      </label>
      <label>
        Fit
        <select value={fit} onChange={(e) => setFit(e.target.value)}>
          <option value="snug">Snug</option>
          <option value="regular">Regular</option>
          <option value="loose">Loose</option>
        </select>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Finding...' : 'Find my size'}
      </button>
    </form>
  );
}