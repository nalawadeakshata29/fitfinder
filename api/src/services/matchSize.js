// Extra room (cm) a garment needs compared with the body. These are assumptions.
const GARMENT_EASE_CM = { snug: 4, regular: 8, loose: 14 };

// For body charts, the fit preference only nudges the target slightly (cm).
const BODY_NUDGE_CM = { snug: -2, regular: 0, loose: 2 };

// How much each measurement counts. Bust matters most.
const WEIGHTS = { chest: 1, waist: 0.5, hips: 0.5 };

// How far a value is from a range. 0 if it is inside the range.
function distanceToRange(value, range) {
  if (value < range.min) return range.min - value;
  if (value > range.max) return value - range.max;
  return 0;
}

// chart: one size chart (sizes with chest/waist/hips ranges)
// body:  { bust, waist, hips }  in cm. Only bust is required.
// fit:   'snug' | 'regular' | 'loose'
export function matchSize(chart, body, fit = 'regular') {
  const isGarment = chart.measurementType === 'garment';

  // Work out the target numbers we compare against each size
  const targets = {};
  if (isGarment) {
    // Garment charts only compare bust, with extra room added
    targets.chest = body.bust + GARMENT_EASE_CM[fit];
  } else {
    const nudge = BODY_NUDGE_CM[fit];
    targets.chest = body.bust + nudge;
    if (body.waist) targets.waist = body.waist + nudge;
    if (body.hips) targets.hips = body.hips + nudge;
  }

  // Score every size. Lower score = closer fit.
  const scored = [];
  for (const size of chart.sizes) {
    let total = 0;
    let weightUsed = 0;
    for (const key of Object.keys(targets)) {
      if (!size[key]) continue; // this chart has no such measurement
      total += WEIGHTS[key] * distanceToRange(targets[key], size[key]);
      weightUsed += WEIGHTS[key];
    }
    if (weightUsed > 0) scored.push({ label: size.label, score: total / weightUsed });
  }

  if (scored.length === 0) return null;

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];
  const second = scored[1];

  // Confidence
  let confidence = 'high';
  if (best.score > 6) confidence = 'low';
  else if (second && second.score - best.score < 1.5) confidence = 'medium';
  if (isGarment && confidence === 'high') confidence = 'medium'; // garment charts are estimates

  // A short explanation for the user
  let note = '';
  if (confidence === 'low') note = 'Your measurements are far from this chart';
  else if (second && second.score - best.score < 1.5) note = `Between ${best.label} and ${second.label}`;
  else if (isGarment) note = 'Estimated from garment measurements';

  return {
    size: best.label,
    confidence,
    note,
    score: Number(best.score.toFixed(1)),
  };
}