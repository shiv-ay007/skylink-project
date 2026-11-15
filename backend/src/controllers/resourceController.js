import User from '../models/User.js';
import Shipment from '../models/Shipment.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Port from '../models/Port.js';
import Vessel from '../models/Vessel.js';
import Vehicle from '../models/Vehicle.js';
import News from '../models/News.js';
import Quote from '../models/Quote.js';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import {AppError,escapeRegex,pagination,parseId} from '../utils/api.js';

const configs={
 users:{model:User,fields:['name','email','password','phone','company','role','isActive'],search:['name','email','company'],filter:['role','isActive'],sort:['name','createdAt']},
 shipments:{model:Shipment,fields:['trackingNumber','blNumber','bookingNumber','purchaseOrderNumber','containerNumber','customer','origin','destination','vessel','status','departureDate','arrivalDate','description','timeline'],search:['trackingNumber','containerNumber','blNumber','bookingNumber','origin','destination'],filter:['status'],sort:['trackingNumber','createdAt','departureDate'],populate:'customer',public:false},
 bookings:{model:Booking,fields:['bookingNumber','customer','origin','destination','cargoType','cargoDescription','containerType','quantity','preferredDate','notes','status','shipment'],search:['bookingNumber','origin','destination'],filter:['status'],sort:['bookingNumber','createdAt','preferredDate'],populate:'customer'},
 schedules:{model:Schedule,fields:['vessel','origin','destination','departure','arrival','voyageNumber','status'],search:['origin','destination','voyageNumber'],filter:['status'],sort:['departure','createdAt'],populate:'vessel'},
 ports:{model:Port,fields:['name','code','country','region','address'],search:['name','code','country','region'],filter:['country'],sort:['name','createdAt']},
 vessels:{model:Vessel,fields:['name','imo','flag','capacityTEU','type','status'],search:['name','imo','flag'],filter:['status'],sort:['name','createdAt']},
 vehicles:{model:Vehicle,fields:['registrationNumber','type','driverName','driverPhone','assignedShipment','status'],search:['registrationNumber','driverName','type'],filter:['status'],sort:['registrationNumber','createdAt']},
 news:{model:News,fields:['title','slug','category','excerpt','content','imageUrl','status','publishedAt','author'],search:['title','category','slug'],filter:['status','category'],sort:['title','publishedAt','createdAt']},
 quotes:{model:Quote,fields:['status'],search:['name','email','origin','destination'],filter:['status'],sort:['createdAt']},
 messages:{model:Message,fields:['status'],search:['name','email','subject'],filter:['status'],sort:['createdAt']}
};
const getConfig=(req)=>{const config=configs[req.params.resource];if(!config)throw new AppError('Unknown resource',404);return config;};
const pick=(obj,fields)=>Object.fromEntries(fields.filter(f=>Object.prototype.hasOwnProperty.call(obj,f)).map(f=>[f,obj[f]]));
function filterFromQuery(query,config){
 const out={};for(const k of config.filter||[]){if(query[k]!==undefined&&query[k]!=='')out[k]=query[k];}
 const search=String(query.search||'').trim().slice(0,100);
 if(search&&config.search?.length)out.$or=config.search.map(field=>({[field]:{$regex:escapeRegex(search),$options:'i'}}));
 return out;
}
function resolveSort(query,config){
 const raw=String(query.sort||'-createdAt');const desc=raw.startsWith('-');const field=desc?raw.slice(1):raw;
 const approved=(config.sort||[]).includes(field)?field:'createdAt';return{[approved]:desc?-1:1,_id:1};
}
export const list=asyncHandler(async(req,res)=>{
 const cfg=getConfig(req);const {page,limit,skip}=pagination(req.query);const filter=filterFromQuery(req.query,cfg);
 let cursor=cfg.model.find(filter).sort(resolveSort(req.query,cfg)).skip(skip).limit(limit).lean();
 if(cfg.populate)cursor=cursor.populate(cfg.populate, cfg.populate==='customer'?'name email company':'name imo');
 const [data,total]=await Promise.all([cursor.exec(),cfg.model.countDocuments(filter)]);
 res.json({success:true,data,pagination:{page,limit,total,pages:Math.ceil(total/limit)}});
});
export const getOne=asyncHandler(async(req,res)=>{
 const cfg=getConfig(req);let cursor=cfg.model.findById(parseId(req.params.id)).lean();
 if(cfg.populate)cursor=cursor.populate(cfg.populate,cfg.populate==='customer'?'name email company':'name imo');
 const data=await cursor;if(!data)throw new AppError('Record not found',404);
 res.json({success:true,data});
});
export const create=asyncHandler(async(req,res)=>{
 const cfg=getConfig(req);if(['quotes','messages'].includes(req.params.resource))throw new AppError('Create via public form',405);
 const payload=pick(req.body,cfg.fields);
 if(req.params.resource==='news'&&!payload.author)payload.author=req.user._id;
 if(req.params.resource==='users'&&(!payload.password||payload.password.length<8))throw new AppError('Password must have 8+ characters',400);
 if(req.params.resource==='users'&&payload.role==='admin'&&req.user.role!=='admin')throw new AppError('Not authorized',403);
 const data=await cfg.model.create(payload);res.status(201).json({success:true,message:'Created successfully',data});
});
export const update=asyncHandler(async(req,res)=>{
 const cfg=getConfig(req);const doc=await cfg.model.findById(parseId(req.params.id));if(!doc)throw new AppError('Record not found',404);
 const patch=pick(req.body,cfg.fields);
 if(req.params.resource==='users'&&req.user._id.toString()===doc._id.toString()){
  if(patch.isActive===false||patch.role&&patch.role!=='admin')throw new AppError('You cannot remove your own admin access',400);
 }
 if(req.params.resource==='users'&&patch.password&&patch.password.length<8)throw new AppError('Password must have 8+ characters',400);
 if(req.params.resource==='shipments'&&patch.status&&patch.status!==doc.status){
  if(Array.isArray(patch.timeline)){doc.timeline=patch.timeline;delete patch.timeline;}
  doc.timeline.push({status:patch.status,message:'Status updated by admin',date:new Date()});
 }
 if(req.params.resource==='news'&&patch.status==='published'&&!doc.publishedAt&&!patch.publishedAt)patch.publishedAt=new Date();
 Object.assign(doc,patch);await doc.save();res.json({success:true,message:'Updated successfully',data:doc});
});
export const remove=asyncHandler(async(req,res)=>{
 const cfg=getConfig(req);const id=parseId(req.params.id);
 if(req.params.resource==='users'&&id===req.user._id.toString())throw new AppError('You cannot delete yourself',400);
 const data=await cfg.model.findByIdAndDelete(id);if(!data)throw new AppError('Record not found',404);
 res.json({success:true,message:'Deleted successfully'});
});
