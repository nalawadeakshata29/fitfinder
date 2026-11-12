import { DEFAULT_FORM } from '../constants.js';

export default function SizeForm({
  formData = DEFAULT_FORM,
  onChange,
  onSubmit,
  onClear,
  loading = false,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (onChange) {
      onChange({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="form size-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="bust">
            Bust (cm) <span className="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="bust"
            name="bust"
            type="number"
            inputMode="decimal"
            min="60"
            max="160"
            step="0.1"
            value={formData.bust}
            onChange={handleChange}
            placeholder="e.g. 88"
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="waist">Waist (cm)</label>
          <input
            id="waist"
            name="waist"
            type="number"
            inputMode="decimal"
            min="40"
            max="160"
            step="0.1"
            value={formData.waist}
            onChange={handleChange}
            placeholder="optional"
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="hips">Hips (cm)</label>
          <input
            id="hips"
            name="hips"
            type="number"
            inputMode="decimal"
            min="60"
            max="180"
            step="0.1"
            value={formData.hips}
            onChange={handleChange}
            placeholder="optional"
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="fit">Fit</label>
          <select
            id="fit"
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="snug">Snug</option>
            <option value="regular">Regular</option>
            <option value="loose">Loose</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Finding\u2026' : 'Find my size'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      <p className="form-hint">Your measurements are saved in this browser only.</p>
    </form>
  );
}
