import {AppError} from '../utils/api.js';
export const notFound=(req,_res,next)=>next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`,404));
export const errorHandler=(err,_req,res,_next)=>{
 let status=err.statusCode||500;let message=err.message||'Internal server error';
 if(err.name==='ValidationError'){status=400;message=Object.values(err.errors).map(e=>e.message).join(', ');}
 if(err.name==='CastError'){status=400;message='Invalid reference id';}
 if(err.name==='MongoServerError'&&err.code===11000){status=409;message=`Duplicate value for ${Object.keys(err.keyValue||{}).join(', ')}`;}
 if(err.name==='MulterError'){status=400;message=err.message;}
 if(status>=500) console.error(err);
 res.status(status).json({success:false,message:status>=500&&process.env.NODE_ENV==='production'?'Internal server error':message});
};
