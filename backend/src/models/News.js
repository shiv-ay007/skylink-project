import mongoose from 'mongoose';
const schema=new mongoose.Schema({title:{type:String,required:true,trim:true},slug:{type:String,required:true,lowercase:true,trim:true,unique:true},category:{type:String,required:true,trim:true},excerpt:String,content:{type:String,required:true},imageUrl:String,status:{type:String,enum:['draft','published'],default:'draft'},publishedAt:Date,author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
schema.index({status:1,publishedAt:-1});
export default mongoose.model('News',schema);
