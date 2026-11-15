import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'site' },
  companyName: { type: String, default: '' },
  heroTitle: { type: String, default: '' }, heroImage: { type: String, default: '' },
  logoUrl: { type: String, default: '' }, tagline: { type: String, default: '' },
  about: { type: String, default: '' }, address: { type: String, default: '' },
  supportEmail: { type: String, default: '' }, phone: { type: String, default: '' },
  copyright: { type: String, default: '' },
  social: { facebook: String, twitter: String, linkedin: String, instagram: String },
  notifications: { email: Boolean, sms: Boolean, push: Boolean, weeklyReports: Boolean }
}, { timestamps: true });
export default mongoose.model('Settings', schema);
