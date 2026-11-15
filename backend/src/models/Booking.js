import mongoose from 'mongoose';
const schema=new mongoose.Schema({
 bookingNumber:{type:String,required:true,unique:true,uppercase:true,trim:true},
 customer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 origin:{type:String,required:true,trim:true},destination:{type:String,required:true,trim:true},
 cargoType:{type:String,enum:['general','reefer','hazardous','oversized','other'],default:'general'},
 cargoDescription:String,containerType:String,quantity:{type:Number,min:1,default:1},
 preferredDate:{type:Date,required:true},notes:String,
 status:{type:String,enum:['PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','REJECTED','CANCELLED'],default:'PENDING'},
 shipment:{type:mongoose.Schema.Types.ObjectId,ref:'Shipment'}
},{timestamps:true});
schema.index({customer:1,createdAt:-1});schema.index({status:1,createdAt:-1});
export default mongoose.model('Booking',schema);
