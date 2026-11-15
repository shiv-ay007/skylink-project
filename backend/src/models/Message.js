import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true},subject:{type:String,required:true},message:{type:String,required:true},status:{type:String,enum:['NEW','READ','REPLIED'],default:'NEW'}},{timestamps:true});
schema.index({status:1,createdAt:-1});
export default mongoose.model('Message',schema);
