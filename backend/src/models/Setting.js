import mongoose from 'mongoose';
const schema=new mongoose.Schema({
 key:{type:String,unique:true,default:'main',immutable:true},companyName:{type:String,default:''},
 supportEmail:{type:String,default:''},phone:{type:String,default:''},address:{type:String,default:''},
 heroTitle:{type:String,default:''},heroSubtitle:{type:String,default:''},heroImage:{type:String,default:''},
 logoUrl:{type:String,default:''},footerDescription:{type:String,default:''},copyright:{type:String,default:''},
 aboutContent:{type:String,default:''},faqContent:{type:String,default:''},termsContent:{type:String,default:''},privacyContent:{type:String,default:''},careersContent:{type:String,default:''},
 socialLinks:{facebook:String,twitter:String,linkedin:String,instagram:String},
 services:[{title:{type:String,required:true},description:String,imageUrl:String,slug:String}],
 notifications:{email:{type:Boolean,default:false},sms:{type:Boolean,default:false},push:{type:Boolean,default:false},weeklyReports:{type:Boolean,default:false}}
},{timestamps:true});
export default mongoose.model('Setting',schema);
