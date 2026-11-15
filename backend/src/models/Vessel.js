import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},imo:{type:String,required:true,trim:true,unique:true},flag:String,capacityTEU:{type:Number,min:0},type:{type:String,default:'Container Ship'},status:{type:String,enum:['ACTIVE','INACTIVE','MAINTENANCE'],default:'ACTIVE'}},{timestamps:true});
export default mongoose.model('Vessel',schema);
