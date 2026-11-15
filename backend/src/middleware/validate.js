import {z} from 'zod';
import {AppError} from '../utils/api.js';
const required=z.string().trim().min(1).max(200);
const email=z.string().trim().email().max(200);
const password=z.string().min(8).max(128);
export const schemas={
 register:z.object({name:required,email,password,phone:z.string().max(40).optional(),company:z.string().max(150).optional()}),
 adminRegister:z.object({name:required,email,password,setupKey:required}),
 login:z.object({email,password:z.string().min(1)}),
 google:z.object({idToken:z.string().min(100).max(10000)}),
 booking:z.object({origin:required,destination:required,preferredDate:z.string().refine(v=>!Number.isNaN(Date.parse(v)),'Invalid preferred date'),cargoType:z.enum(['general','reefer','hazardous','oversized','other']).optional(),cargoDescription:z.string().max(4000).optional(),containerType:z.string().max(120).optional(),quantity:z.coerce.number().int().min(1).max(10000).optional(),notes:z.string().max(4000).optional()}),
 quote:z.object({name:required,email,origin:required,destination:required,phone:z.string().max(40).optional(),company:z.string().max(150).optional(),cargoType:z.string().max(100).optional(),weight:z.string().max(100).optional(),message:z.string().max(4000).optional()}),
 contact:z.object({name:required,email,subject:required,message:z.string().trim().min(1).max(4000)})
};
export const validate=(schema)=>(req,_res,next)=>{
 const result=schema.safeParse(req.body);
 if(!result.success){return next(new AppError(result.error.issues.map(issue=>`${issue.path.join('.')}: ${issue.message}`).join('; '),400));}
 req.body=result.data;next();
};
