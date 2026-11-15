import mongoose from 'mongoose';
const timelineSchema = new mongoose.Schema({status:{type:String,required:true},location:String,message:String,date:{type:Date,default:Date.now}},{_id:false});
const schema = new mongoose.Schema({
 trackingNumber:{type:String,required:true,unique:true,uppercase:true,trim:true,index:true},
 blNumber:{type:String,trim:true,uppercase:true,index:true,sparse:true},
 bookingNumber:{type:String,trim:true,uppercase:true,index:true,sparse:true},
 purchaseOrderNumber:{type:String,trim:true,uppercase:true,index:true,sparse:true},
 containerNumber:{type:String,required:true,uppercase:true,trim:true,index:true},
 customer:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
 origin:{type:String,required:true,trim:true},destination:{type:String,required:true,trim:true},
 vessel:{type:mongoose.Schema.Types.ObjectId,ref:'Vessel'},
 status:{type:String,enum:['BOOKED','PICKED_UP','IN_TRANSIT','AT_PORT','CUSTOMS','DELIVERED','CANCELLED'],default:'BOOKED'},
 departureDate:Date,arrivalDate:Date,description:String,
 timeline:{type:[timelineSchema],default:[]}
},{timestamps:true});
schema.index({status:1,createdAt:-1});schema.index({customer:1,createdAt:-1});
export default mongoose.model('Shipment',schema);
