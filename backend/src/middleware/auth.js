import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import {AppError} from '../utils/api.js';
export const protect=asyncHandler(async(req,_res,next)=>{
 const header=req.headers.authorization||'';
 const token=header.startsWith('Bearer ')?header.slice(7):null;
 if(!token)throw new AppError('Please log in to continue',401);
 let payload;try{payload=jwt.verify(token,process.env.JWT_SECRET);}catch{throw new AppError('Session expired or invalid token',401);}
 const user=await User.findById(payload.sub).select('-password').lean();
 if(!user||!user.isActive)throw new AppError('Account is unavailable',401);
 req.user=user;next();
});
export const authorize=(...roles)=>(req,_res,next)=>roles.includes(req.user?.role)?next():next(new AppError('You do not have permission for this action',403));
