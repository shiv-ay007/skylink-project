import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, address: { type: String, required: true },
  city: String, country: String, phone: String, email: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Office', schema);
