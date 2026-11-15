import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, unique: true },
  description: String, imageUrl: String,
  isActive: { type: Boolean, default: true }, order: { type: Number, default: 0 }
}, { timestamps: true });
schema.index({ isActive: 1, order: 1 });
export default mongoose.model('Service', schema);
