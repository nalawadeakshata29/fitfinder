import fs from 'node:fs';
import { matchSize } from './matchSize.js';

const brands = JSON.parse(
  fs.readFileSync(new URL('../seed/brands.json', import.meta.url), 'utf8')
);
const toRange = (r) => (r ? { min: r[0], max: r[1] } : undefined);

for (const b of brands) {
  for (const c of b.charts) {
    const chart = {
      measurementType: c.measurementType,
      sizes: c.sizes.map((s) => ({
        label: s.label,
        chest: toRange(s.chest),
        waist: toRange(s.waist),
        hips: toRange(s.hips),
      })),
    };
    const ease = c.measurementType === 'garment' ? 8 : 0;
    let problems = 0;

    for (const s of c.sizes) {
      const bust = s.chest[0] - ease;
      const r = matchSize(chart, { bust }, 'regular');
      if (r.size !== s.label) {
        problems++;
        console.log(`  MISMATCH ${b.name}: bust ${bust} should give ${s.label}, got ${r.size}`);
      }
    }
    console.log(`${b.name} (${c.measurementType}): ${problems === 0 ? 'OK' : problems + ' problems'}`);
  }
}