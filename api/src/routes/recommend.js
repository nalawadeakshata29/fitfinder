import { Router } from 'express';
import SizeChart from '../models/SizeChart.js';
import { matchSize } from '../services/matchSize.js';

const router = Router();

const FITS = ['snug', 'regular', 'loose'];
const GENDERS = ['women'];

// True if value is a number inside [min, max]
const inRange = (v, min, max) => typeof v === 'number' && v >= min && v <= max;

// Check the request body and return a list of problems (empty list = valid)
function validate(b) {
  const errors = [];
  if (b.gender !== undefined && !GENDERS.includes(b.gender)) errors.push('only "women" is supported for now');
  if (!inRange(b.bust, 60, 160)) errors.push('bust must be a number between 60 and 160 (cm)');
  if (b.waist !== undefined && !inRange(b.waist, 40, 160)) errors.push('waist must be between 40 and 160 (cm)');
  if (b.hips !== undefined && !inRange(b.hips, 60, 180)) errors.push('hips must be between 60 and 180 (cm)');
  if (b.fit !== undefined && !FITS.includes(b.fit)) errors.push('fit must be "snug", "regular" or "loose"');
  return errors;
}

router.post('/', async (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { bust, waist, hips } = req.body;
  const gender = req.body.gender || 'women';
  const fit = req.body.fit || 'regular';
  const category = req.body.category || 'tops';

  // Load every chart for this gender and category, with its brand attached
  const charts = await SizeChart.find({ gender, category }).populate('brandId').lean();

  const results = [];
  for (const chart of charts) {
    const match = matchSize(chart, { bust, waist, hips }, fit);
    if (!match) continue;
    results.push({
      brand: chart.brandId.name,
      slug: chart.brandId.slug,
      size: match.size,
      confidence: match.confidence,
      note: match.note,
      chartType: chart.measurementType,
    });
  }

  results.sort((a, b) => a.brand.localeCompare(b.brand));

  res.json({ input: { gender, category, bust, waist, hips, fit }, results });
});

export default router;