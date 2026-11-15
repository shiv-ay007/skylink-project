import Shipment from '../models/Shipment.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Port from '../models/Port.js';
import News from '../models/News.js';
import Setting from '../models/Setting.js';
import Quote from '../models/Quote.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import {AppError,escapeRegex,pagination,parseId} from '../utils/api.js';
import {notifyNewRequest} from '../utils/mailer.js';
const pageInfo=(page,limit,total)=>({page,limit,total,pages:Math.ceil(total/limit)});
const listPublic=(model,filterFn,sort,populate=null)=>asyncHandler(async(req,res)=>{
 const {page,limit,skip}=pagination(req.query);
 const filter=filterFn(req.query);
 let q=model.find(filter).sort(sort).skip(skip).limit(limit).lean();if(populate)q=q.populate(populate);
 const [data,total]=await Promise.all([q.exec(),model.countDocuments(filter)]);
 res.json({success:true,data,pagination:pageInfo(page,limit,total)});
});
export const publicSettings=asyncHandler(async(_req,res)=>{
 const settings=await Setting.findOne({key:'main'}).select('-notifications').lean();
 res.json({success:true,data:settings||null});
});
export const adminSettings=asyncHandler(async(_req,res)=>{
 const settings=await Setting.findOne({key:'main'}).lean();res.json({success:true,data:settings||null});
});
export const updateSettings=asyncHandler(async(req,res)=>{
 const fields=['companyName','supportEmail','phone','address','heroTitle','heroSubtitle','heroImage','logoUrl','footerDescription','copyright','aboutContent','faqContent','termsContent','privacyContent','careersContent','socialLinks','services','notifications'];
 const allowed=Object.fromEntries(fields.filter(k=>Object.prototype.hasOwnProperty.call(req.body,k)).map(k=>[k,req.body[k]]));
 const settings=await Setting.findOneAndUpdate({key:'main'},{$set:allowed},{new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});
 res.json({success:true,message:'Website settings saved',data:settings});
});
export const trackShipment=asyncHandler(async(req,res)=>{
 const values=String(req.query.numbers||req.query.number||'').split(/[\s,]+/).map(v=>v.trim().toUpperCase()).filter(Boolean);
 if(!values.length)throw new AppError('Enter one or more tracking numbers',400);
 if(values.length>10)throw new AppError('Maximum 10 tracking numbers at once',400);
 if(values.some(v=>v.length>60))throw new AppError('Tracking number is too long',400);
 const fields=['trackingNumber','blNumber','bookingNumber','purchaseOrderNumber','containerNumber'];
 const data=await Shipment.find({$or:fields.map(k=>({[k]:{$in:values}}))}).select('-customer').lean();
 res.json({success:true,data,notFound:values.filter(n=>!data.some(s=>fields.some(f=>s[f]===n)))});
});
export const publicSchedules=listPublic(Schedule,q=>{
 const filter={};if(q.origin)filter.origin=new RegExp(escapeRegex(String(q.origin).slice(0,100)),'i');
 if(q.destination)filter.destination=new RegExp(escapeRegex(String(q.destination).slice(0,100)),'i');
 if(q.from||q.to){filter.departure={};if(q.from)filter.departure.$gte=new Date(q.from);if(q.to)filter.departure.$lte=new Date(q.to);}
 return filter;
},{departure:1},{path:'vessel',select:'name imo'});
export const publicPorts=listPublic(Port,q=>q.search?{$or:['name','code','region','country'].map(k=>({[k]:new RegExp(escapeRegex(String(q.search).slice(0,100)),'i')}))}: {},{name:1});
export const publicNews=listPublic(News,q=>({status:'published',...(q.category?{category:String(q.category)}:{})}),{publishedAt:-1,createdAt:-1});
export const newsDetail=asyncHandler(async(req,res)=>{
 const data=await News.findOne({slug:req.params.slug,status:'published'}).lean();if(!data)throw new AppError('Article not found',404);res.json({success:true,data});
});
export const createQuote=asyncHandler(async(req,res)=>{
 const required=['name','email','origin','destination'];if(required.some(k=>!String(req.body[k]||'').trim()))throw new AppError('Name, email, origin and destination are required',400);
 const payload=Object.fromEntries(['name','email','phone','company','origin','destination','cargoType','weight','message'].filter(k=>req.body[k]!==undefined).map(k=>[k,String(req.body[k]).trim().slice(0,3000)]));
 const data=await Quote.create(payload);void notifyNewRequest('New quote request',`A new quote request was received (${data._id})`);
 res.status(201).json({success:true,message:'Quote request submitted',data:{id:data._id}});
});
export const createMessage=asyncHandler(async(req,res)=>{
 const required=['name','email','subject','message'];if(required.some(k=>!String(req.body[k]||'').trim()))throw new AppError('All fields are required',400);
 const payload=Object.fromEntries(required.map(k=>[k,String(req.body[k]).trim().slice(0,3000)]));
 const data=await Message.create(payload);void notifyNewRequest('New contact message',`New message received (${data._id})`);
 res.status(201).json({success:true,message:'Your message has been sent',data:{id:data._id}});
});
export const myBookings=asyncHandler(async(req,res)=>{
 const {page,limit,skip}=pagination(req.query);const filter={customer:req.user._id};
 const [data,total]=await Promise.all([Booking.find(filter).sort({createdAt:-1}).skip(skip).limit(limit).lean(),Booking.countDocuments(filter)]);
 res.json({success:true,data,pagination:pageInfo(page,limit,total)});
});
export const createBooking=asyncHandler(async(req,res)=>{
 const required=['origin','destination','preferredDate'];if(required.some(k=>!req.body[k]))throw new AppError('Origin, destination and preferred date are required',400);
 const fields=['origin','destination','cargoType','cargoDescription','containerType','quantity','preferredDate','notes'];
 const payload=Object.fromEntries(fields.filter(k=>req.body[k]!==undefined).map(k=>[k,req.body[k]]));
 const bookingNumber=`BK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,7).toUpperCase()}`;
 const booking=await Booking.create({...payload,customer:req.user._id,bookingNumber});
 res.status(201).json({success:true,message:'Booking request submitted',data:booking});
});
export const cancelBooking=asyncHandler(async(req,res)=>{
 const booking=await Booking.findOne({_id:parseId(req.params.id),customer:req.user._id});
 if(!booking)throw new AppError('Booking not found',404);
 if(!['PENDING','CONFIRMED'].includes(booking.status))throw new AppError('Booking cannot be cancelled at this stage',400);
 booking.status='CANCELLED';await booking.save();res.json({success:true,message:'Booking cancelled',data:booking});
});
