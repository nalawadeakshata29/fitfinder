import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import SizeForm from './components/SizeForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import CompareTable from './components/CompareTable.jsx';
import MeasureGuide from './components/MeasureGuide.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { DEFAULT_FORM } from './constants.js';
import { getRecommendations } from './api.js';

export default function App() {
  const [formData, setFormData] = useLocalStorage('fitfinder-form', DEFAULT_FORM);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'compare'
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  // Executes recommendation search and synchronizes URL query params
  const executeSearch = useCallback(async (formValues) => {
    setLoading(true);
    setError('');

    const body = {
      bust: Number(formValues.bust),
      fit: formValues.fit || 'regular',
    };
    if (formValues.waist !== '' && formValues.waist !== undefined && formValues.waist !== null) {
      body.waist = Number(formValues.waist);
    }
    if (formValues.hips !== '' && formValues.hips !== undefined && formValues.hips !== null) {
      body.hips = Number(formValues.hips);
    }

    try {
      const data = await getRecommendations(body);
      setResults(data.results);

      // Write measurements into URL query string for sharing
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('bust', String(formValues.bust));
        if (formValues.waist) {
          url.searchParams.set('waist', String(formValues.waist));
        } else {
          url.searchParams.delete('waist');
        }
        if (formValues.hips) {
          url.searchParams.set('hips', String(formValues.hips));
        } else {
          url.searchParams.delete('hips');
        }
        if (formValues.fit) {
          url.searchParams.set('fit', String(formValues.fit));
        } else {
          url.searchParams.delete('fit');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Storage / URL state access restricted
      }
    } catch (err) {
      setResults(null);
      const isNetworkError =
        err instanceof TypeError ||
        err.name === 'TypeError' ||
        (err.message && err.message.toLowerCase().includes('failed to fetch')) ||
        (err.message && err.message.toLowerCase().includes('network'));

      if (isNetworkError) {
        setError(
          'Could not reach the server. It may be waking up, please try again in a moment.'
        );
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check URL on page load: if bust param is present, fill form and search automatically
  useEffect(() => {
    let timerId;
    try {
      const params = new URLSearchParams(window.location.search);
      const bustParam = params.get('bust');
      if (bustParam) {
        const fromUrl = {
          bust: bustParam,
          waist: params.get('waist') || '',
          hips: params.get('hips') || '',
          fit: ['snug', 'regular', 'loose'].includes(params.get('fit'))
            ? params.get('fit')
            : 'regular',
        };
        setFormData(fromUrl);
        // Defer search execution to next tick to avoid synchronous cascading renders
        timerId = setTimeout(() => {
          executeSearch(fromUrl);
        }, 0);
      }
    } catch {
      // Browser navigation / URLSearchParams restricted
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [executeSearch, setFormData]);

  // Cleanup copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Resets the form, removes URL query params, and clears current results
  const handleClear = () => {
    setFormData(DEFAULT_FORM);
    setResults(null);
    setError('');
    try {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore
    }
  };

  // Copies the current shareable link to clipboard
  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard access blocked
    }
  };

  // Computes the most common size from the results list
  const summaryText = useMemo(() => {
    if (!results || results.length === 0) return '';
    const counts = {};
    for (const r of results) {
      if (r.size) {
        counts[r.size] = (counts[r.size] || 0) + 1;
      }
    }
    let maxCount = 0;
    let topSize = '';
    for (const [size, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        topSize = size;
      }
    }
    if (!topSize) return '';
    return `Most common: ${topSize} (${maxCount} of ${results.length} brands)`;
  }, [results]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo-group">
            <span className="logo">FitFinder</span>
          </div>
          <span className="category-tag">Women&apos;s tops</span>
        </div>
      </header>

      <div className="container">
        <section className="hero">
          <h1>Find your size in every brand</h1>
          <p className="hero-subtitle">
            Enter your measurements once to compare your fit across 7 leading clothing brands.
          </p>
        </section>

        <main>
          <section className="form-card" aria-label="Measurements entry">
            <SizeForm
              formData={formData}
              onChange={setFormData}
              onSubmit={executeSearch}
              onClear={handleClear}
              loading={loading}
            />
          </section>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="spinner" aria-hidden="true" />
              <p>Finding your size across brands&hellip;</p>
            </div>
          )}

          {results && results.length > 0 && (
            <section className="results-section" aria-labelledby="results-heading">
              <div className="results-header">
                <div>
                  <h2 id="results-heading">Your sizes</h2>
                  {summaryText && <p className="summary-line">{summaryText}</p>}
                </div>

                <div className="results-controls">
                  <div className="btn-group" role="group" aria-label="Results layout view">
                    <button
                      type="button"
                      className={`btn btn-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                      onClick={() => setViewMode('cards')}
                      aria-pressed={viewMode === 'cards'}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      className={`btn btn-toggle ${viewMode === 'compare' ? 'active' : ''}`}
                      onClick={() => setViewMode('compare')}
                      aria-pressed={viewMode === 'compare'}
                    >
                      Compare
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-copy"
                    onClick={handleCopyLink}
                    aria-label="Copy shareable link"
                  >
                    {copied ? 'Link copied' : 'Copy link'}
                  </button>
                </div>
              </div>

              {viewMode === 'cards' ? (
                <div className="grid">
                  {results.map((r) => (
                    <ResultCard key={r.slug || r.brand} result={r} />
                  ))}
                </div>
              ) : (
                <CompareTable results={results} />
              )}

              <p className="disclaimer">
                Estimates from public marketplace size charts. Garment charts are approximate, so check the brand&apos;s own guide before you buy.
              </p>
            </section>
          )}

          <section className="guide-section">
            <MeasureGuide />
          </section>
        </main>

        <footer className="footer">
          <p>FitFinder &bull; Women&apos;s top sizing across Allen Solly, Biba, H&amp;M, Levi&apos;s, Max Fashion, Nike, and Vero Moda.</p>
        </footer>
      </div>
    </div>
  );
}
