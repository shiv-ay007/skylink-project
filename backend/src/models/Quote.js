import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true},phone:String,company:String,origin:{type:String,required:true},destination:{type:String,required:true},cargoType:String,weight:String,message:String,status:{type:String,enum:['NEW','CONTACTED','QUOTED','CLOSED'],default:'NEW'}},{timestamps:true});
schema.index({status:1,createdAt:-1});
export default mongoose.model('Quote',schema);
