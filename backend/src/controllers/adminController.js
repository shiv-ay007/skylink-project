import User from '../models/User.js';
import Shipment from '../models/Shipment.js';
import Booking from '../models/Booking.js';
import Vessel from '../models/Vessel.js';
import Settings from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { escapeRegex, paging, pagedResult } from '../utils/query.js';
const pick = (obj, keys) => Object.fromEntries(keys.filter(k=>Object.hasOwn(obj,k)).map(k=>[k,obj[k]]));
export const dashboard = asyncHandler(async(req,res) => {
  const [users, shipments, bookings, vessels, recentShipments] = await Promise.all([
    User.countDocuments(), Shipment.countDocuments(), Booking.countDocuments(), Vessel.countDocuments(),
    Shipment.find().sort({createdAt:-1}).limit(5).select('trackingNo containerNo origin destination status').lean()
  ]);
  res.json({ users, shipments, bookings, vessels, recentShipments });
});
export const users = asyncHandler(async(req,res) => {
  const { page,limit } = paging(req.query);
  const search=String(req.query.search||'').trim().slice(0,100);
  const filter=search?{$or:['name','email','company'].map(k=>({[k]:{$regex:escapeRegex(search),$options:'i'}}))}:{};
  const [items,total]=await Promise.all([
    User.find(filter).select('-password -__v').sort({createdAt:-1,_id:-1}).skip((page-1)*limit).limit(limit).lean(),
    User.countDocuments(filter)
  ]);
  res.json(pagedResult(items,total,page,limit));
});
export const createUser = asyncHandler(async(req,res) => {
  const data=pick(req.body,['name','email','password','company','phone','role','isActive']);
  if (!data.password || data.password.length<8) return res.status(400).json({message:'Password must be at least 8 characters'});
  const doc=await User.create(data); res.status(201).json({id:doc.id,name:doc.name,email:doc.email,role:doc.role});
});
export const updateUser = asyncHandler(async(req,res) => {
  const data=pick(req.body,['name','email','password','company','phone','role','isActive']);
  if (String(req.params.id)===String(req.user._id) && (data.role && data.role!=='admin' || data.isActive===false))
    return res.status(400).json({message:'You cannot remove your own admin access'});
  const user=await User.findById(req.params.id).select('+password');
  if (!user) return res.status(404).json({message:'User not found'});
  if (data.password && data.password.length<8) return res.status(400).json({message:'Password must be at least 8 characters'});
  Object.assign(user,data); await user.save();
  res.json({id:user.id,name:user.name,email:user.email,role:user.role,isActive:user.isActive});
});
export const deleteUser = asyncHandler(async(req,res) => {
  if (req.params.id===String(req.user._id)) return res.status(400).json({message:'Cannot delete your own account'});
  const doc=await User.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({message:'User not found'});
  res.json({message:'User deleted'});
});
export const settings = asyncHandler(async(req,res) => {
  const doc=await Settings.findOne({key:'site'}).lean(); res.json(doc || null);
});
export const updateSettings = asyncHandler(async(req,res) => {
  const keys=['companyName','heroTitle','heroImage','logoUrl','tagline','about','address','supportEmail','phone','copyright','social','notifications'];
  const data=pick(req.body,keys);
  const doc=await Settings.findOneAndUpdate({key:'site'},{$set:data},{upsert:true,new:true,runValidators:true,setDefaultsOnInsert:true});
  res.json(doc);
});
