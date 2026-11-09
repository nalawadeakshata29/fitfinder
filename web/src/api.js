const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getRecommendations(body) {
  const res = await fetch(`${API_URL}/api/v1/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors ? data.errors.join(', ') : data.error || 'Request failed');
  }
  return data;
}