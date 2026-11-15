import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { getFirebaseAdminAuth } from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import {AppError} from '../utils/api.js';
import asyncHandler from '../utils/asyncHandler.js';
const tokenFor=user=>jwt.sign({sub:user._id.toString(),role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'1d'});
const safe=user=>{const obj=user.toObject();delete obj.password;return obj;};
export const register=asyncHandler(async(req,res)=>{
 const {name,email,password,phone,company}=req.body;
 if(!name||!email||!password||password.length<8)throw new AppError('Name, valid email and password (min 8 characters) are required',400);
 const user=await User.create({name,email,password,phone,company,role:'customer'});
 res.status(201).json({success:true,token:tokenFor(user),user:safe(user)});
});
export const registerAdmin=asyncHandler(async(req,res)=>{
 const {name,email,password,setupKey}=req.body;
 if(!process.env.ADMIN_SETUP_KEY||setupKey!==process.env.ADMIN_SETUP_KEY)throw new AppError('Invalid admin setup key',403);
 if(await User.exists({role:'admin'}))throw new AppError('Initial administrator already exists. Ask an admin to add users.',409);
 if(!name||!email||!password||password.length<8)throw new AppError('Name, email and password (min 8 chars) are required',400);
 const user=await User.create({name,email,password,role:'admin'});
 res.status(201).json({success:true,token:tokenFor(user),user:safe(user)});
});
export const login=asyncHandler(async(req,res)=>{
 const {email,password}=req.body;
 if(!email||!password)throw new AppError('Email and password are required',400);
 const user=await User.findOne({email:String(email).toLowerCase()}).select('+password');
 if(!user||!user.isActive||!(await user.verifyPassword(password)))throw new AppError('Invalid email or password',401);
 res.json({success:true,token:tokenFor(user),user:safe(user)});
});
export const me=asyncHandler(async(req,res)=>res.json({success:true,data:req.user}));
export const updateMe=asyncHandler(async(req,res)=>{
 const user=await User.findById(req.user._id);
 for(const k of ['name','phone','company'])if(req.body[k]!==undefined)user[k]=req.body[k];
 if(req.body.password){if(req.body.password.length<8)throw new AppError('Password must have 8+ characters',400);user.password=req.body.password;}
 await user.save();res.json({success:true,data:safe(user),message:'Profile updated'});
});

// Exchanges a verified Firebase Google ID token for the existing MongoDB JWT.
// Google sign-in can create CUSTOMER accounts only; never an admin or employee.
export const googleLogin=asyncHandler(async(req,res)=>{
 const {idToken}=req.body;
 let decoded;
 try{
  decoded=await getFirebaseAdminAuth().verifyIdToken(idToken,true);
 }catch(error){
  if(error instanceof AppError)throw error;
  throw new AppError('Google sign-in token could not be verified',401);
 }
 if(decoded.firebase?.sign_in_provider!=='google.com'||!decoded.email||decoded.email_verified!==true){
  throw new AppError('A verified Google account is required',403);
 }
 const email=String(decoded.email).trim().toLowerCase();
 let user=await User.findOne({firebaseUid:decoded.uid});
 if(user&&user.email!==email)throw new AppError('Google account email changed; contact support',409);
 if(!user){
  if(await User.exists({email}))throw new AppError('This email already has a SkyLink account. Login with your existing password; Google account linking is not enabled.',409);
  // Schema needs a password; the unshared random password cannot be used to login.
  // Users who registered with Google continue using Google authentication.
  user=await User.create({
   name:String(decoded.name||email.split('@')[0]).slice(0,120),
   email,
   firebaseUid:decoded.uid,
   password:randomBytes(48).toString('hex'),
   role:'customer'
  });
 }
 if(!user.isActive)throw new AppError('Account has been disabled',403);
 res.json({success:true,token:tokenFor(user),user:safe(user)});
});
