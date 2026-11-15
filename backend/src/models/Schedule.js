import mongoose from 'mongoose';
const schema=new mongoose.Schema({
 vessel:{type:mongoose.Schema.Types.ObjectId,ref:'Vessel',required:true},
 origin:{type:String,required:true,trim:true},destination:{type:String,required:true,trim:true},
 departure:{type:Date,required:true},arrival:{type:Date,required:true},
 voyageNumber:String,status:{type:String,enum:['SCHEDULED','DEPARTED','ARRIVED','CANCELLED'],default:'SCHEDULED'}
},{timestamps:true});
schema.index({departure:1});schema.index({origin:1,destination:1,departure:1});
export default mongoose.model('Schedule',schema);
