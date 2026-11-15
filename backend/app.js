import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_SETUP_KEY'];
for (const key of required) { if (!process.env[key] || process.env[key].startsWith('replace_with_')) throw new Error(`Set a secure ${key} in backend/.env`); }
if (process.env.JWT_SECRET.length < 32 || process.env.ADMIN_SETUP_KEY.length < 16) throw new Error('Use JWT_SECRET >=32 chars and ADMIN_SETUP_KEY >=16 chars');
const app = express(); app.disable('x-powered-by'); app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); app.use(compression());
const allowed = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'https://skylink-project-1.onrender.com',
  'https://skylink-admin-pannel.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean).map(u => u.replace(/\/+$/, ''));

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowed.includes(cleanOrigin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '500kb' })); app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads'), { maxAge: '1d' }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 25, standardHeaders: 'draft-7', legacyHeaders: false });
const publicWriteLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
app.get('/', (_req, res) => res.json({ success: true, message: 'SkyLink API is running successfully' }));
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/public', (req, res, next) => ['POST', 'PATCH'].includes(req.method) ? publicWriteLimiter(req, res, next) : next(), publicRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound); app.use(errorHandler);
const PORT = Number(process.env.PORT) || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))).catch(err => { console.error(err); process.exit(1); });
export default app;
