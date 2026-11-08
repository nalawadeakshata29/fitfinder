import { Router } from 'express';
import Brand from '../models/Brand.js';
import SizeChart from '../models/SizeChart.js';

const router = Router();

// GET /api/v1/brands : list all brands
router.get('/', async (req, res) => {
  const brands = await Brand.find().sort('name').lean();
  res.json(brands);
});

// GET /api/v1/brands/:slug/charts : one brand with its size charts
router.get('/:slug/charts', async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug }).lean();
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  const charts = await SizeChart.find({ brandId: brand._id }).lean();
  res.json({ brand, charts });
});

export default router;