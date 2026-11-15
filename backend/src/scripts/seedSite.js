import 'dotenv/config';
import connectDB from '../config/db.js';
import Setting from '../models/Setting.js';
import mongoose from 'mongoose';

// Image paths point to locally bundled public assets in BOTH frontend and admin panel.
// Services themselves live in MongoDB, not in a frontend fallback list.
const images = {
  'ocean-freight': '/service-images/ocean-freight.webp',
  'special-cargo': '/service-images/special-cargo.webp',
  'reefer': '/service-images/reefer.webp',
  'logistics': '/service-images/logistics.webp',
  'warehousing': '/service-images/warehousing.webp',
};

function assetForService(service) {
  const name = `${service.slug || ''} ${service.title || ''}`.toLowerCase();
  if (/ocean|sea.freight/.test(name)) return images['ocean-freight'];
  if (/special|heavy|oversize/.test(name)) return images['special-cargo'];
  if (/reefer|refrig|cold.chain/.test(name)) return images.reefer;
  if (/warehous|storag/.test(name)) return images.warehousing;
  if (/logistic|road.transport/.test(name)) return images.logistics;
  return '';
}

try {
  await connectDB();
  await Setting.updateOne({ key:'main' }, { $setOnInsert: {
    companyName:'SkyLink', supportEmail:'info@skylinkindia.org', phone:'',
    address:'WINDFALL, SAHAR PLAZA COMPLEX, 508, 5TH, ANDHERI KURLA ROAD, CHAKALA, MAHARASHTRA PINCODE 400059',
    heroTitle:'Your Number ONE Shipping Partner',
    heroSubtitle:'Reliable global logistics and ocean freight.',
    heroImage:'/hero-port.png', logoUrl:'/skylink-logo.png',
    footerDescription:'Your trusted partner in global logistics and ocean freight. Connecting businesses worldwide with reliable shipping solutions.',
    copyright:'© 2008 SkyLink. All rights reserved.',
    services: [
      {title:'Ocean Freight',slug:'ocean-freight',description:'Global ocean freight transportation solutions.',imageUrl:images['ocean-freight']},
      {title:'Special Cargo',slug:'special-cargo',description:'Solutions for special and oversized cargo.',imageUrl:images['special-cargo']},
      {title:'Reefer',slug:'reefer',description:'Temperature-controlled cargo services.',imageUrl:images.reefer},
      {title:'Logistics',slug:'logistics',description:'End-to-end cargo logistics services.',imageUrl:images.logistics},
      {title:'Warehousing',slug:'warehousing',description:'Storage and distribution support.',imageUrl:images.warehousing}
    ]
  } }, { upsert: true });

  // Existing MongoDB installation: fill missing images only; never overwrite the
  // pictures, titles or content previously edited in the admin panel.
  const settings = await Setting.findOne({ key:'main' });
  let updated = 0;
  for (const service of settings?.services || []) {
    if (!service.imageUrl) {
      const imageUrl = assetForService(service);
      if (imageUrl) { service.imageUrl = imageUrl; updated += 1; }
    }
  }
  if (updated) await settings.save();
  console.log(`SkyLink settings ready in MongoDB. Added images to ${updated} existing service(s).`);
} finally {
  await mongoose.disconnect();
}
