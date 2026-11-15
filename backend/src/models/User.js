import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
 name:{type:String,required:true,trim:true,maxlength:120},
 email:{type:String,required:true,unique:true,lowercase:true,trim:true,match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},
 firebaseUid:{type:String,unique:true,sparse:true},
 password:{type:String,required:true,select:false,minlength:8},
 phone:{type:String,default:'',trim:true},company:{type:String,default:'',trim:true},
 role:{type:String,enum:['customer','employee','admin'],default:'customer'},
 isActive:{type:Boolean,default:true}
},{timestamps:true});
userSchema.pre('save',async function(next){if(!this.isModified('password'))return next(); this.password=await bcrypt.hash(this.password,12);next();});
userSchema.methods.verifyPassword=function(password){return bcrypt.compare(password,this.password);};
userSchema.set('toJSON',{transform(_doc,obj){delete obj.password;delete obj.__v;return obj;}});
userSchema.index({role:1,createdAt:-1});
export default mongoose.model('User',userSchema);
