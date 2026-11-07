// Local workaround: use Google DNS because my network blocks MongoDB SRV lookups
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import fs from 'node:fs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Brand from '../models/Brand.js';
import SizeChart from '../models/SizeChart.js';

// Read the data file that sits next to this script
const brandsData = JSON.parse(
  fs.readFileSync(new URL('./brands.json', import.meta.url), 'utf8')
);

// Turns [94, 102] into { min: 94, max: 102 }. Returns undefined if the measurement is missing.
const toRange = (r) => (r ? { min: r[0], max: r[1] } : undefined);

async function seed() {
  await connectDB();

  // Clear old data so the script can be re-run safely
  await SizeChart.deleteMany();
  await Brand.deleteMany();

  let chartCount = 0;

  for (const b of brandsData) {
    // 1. Save the brand
    const brand = await Brand.create({
      name: b.name,
      slug: b.slug,
      country: b.country,
    });

    // 2. Save each of its charts, linked to the brand by brandId
    for (const chart of b.charts) {
      await SizeChart.create({
        brandId: brand._id,
        gender: chart.gender,
        category: chart.category,
        unit: chart.unit,
        source: chart.source,
        sourceUrl: chart.sourceUrl,
        retrievedAt: chart.retrievedAt,
        sizes: chart.sizes.map((s) => ({
          label: s.label,
          chest: toRange(s.chest),
          waist: toRange(s.waist),
          hips: toRange(s.hips),
        })),
      });
      chartCount++;
    }
  }

  console.log(`Seed complete: ${brandsData.length} brands and ${chartCount} size charts added`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});