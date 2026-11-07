import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    country: String,
  },
  { timestamps: true }
);

export default mongoose.model('Brand', brandSchema);