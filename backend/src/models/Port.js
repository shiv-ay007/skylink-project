import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},code:{type:String,required:true,uppercase:true,trim:true,unique:true},country:{type:String,required:true,trim:true},region:{type:String,required:true,trim:true},address:String},{timestamps:true});
schema.index({country:1,region:1});
export default mongoose.model('Port',schema);
