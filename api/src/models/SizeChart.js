import mongoose from 'mongoose';

// A measurement range, like chest: 94 to 102 cm
const rangeSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false }
);

// One size row, like "M" with its chest and waist ranges
const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    chest: rangeSchema,   // for women's sizes this means bust
    waist: rangeSchema,
    hips: rangeSchema,    // optional, mainly for women
  },
  { _id: false }
);

const sizeChartSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    category: { type: String, required: true },
    unit: { type: String, default: 'cm' },
        sizes: [sizeSchema],
        source: String,
    sourceUrl: String,
    retrievedAt: Date,
    measurementType: { type: String, enum: ['body', 'garment'], default: 'body' },
  },
  { timestamps: true }
);

export default mongoose.model('SizeChart', sizeChartSchema);