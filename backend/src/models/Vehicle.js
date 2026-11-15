import mongoose from 'mongoose';
const schema=new mongoose.Schema({registrationNumber:{type:String,required:true,trim:true,uppercase:true,unique:true},type:{type:String,required:true,trim:true},driverName:String,driverPhone:String,assignedShipment:{type:mongoose.Schema.Types.ObjectId,ref:'Shipment'},status:{type:String,enum:['AVAILABLE','ASSIGNED','IN_TRANSIT','MAINTENANCE'],default:'AVAILABLE'}},{timestamps:true});
schema.index({status:1,createdAt:-1});
export default mongoose.model('Vehicle',schema);
