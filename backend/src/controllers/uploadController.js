import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';
const root=path.resolve('public/uploads');fs.mkdirSync(root,{recursive:true});
const types={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp'};
export const upload=multer({
  storage:multer.diskStorage({destination:(req,file,cb)=>cb(null,root),filename:(req,file,cb)=>cb(null,`${randomUUID()}${types[file.mimetype]||'.bin'}`)}),
  limits:{fileSize:5*1024*1024},
  fileFilter:(req,file,cb)=>types[file.mimetype]?cb(null,true):cb(Object.assign(new Error('Only JPEG, PNG or WebP images accepted'),{statusCode:400}))
});
export const uploadImage=(req,res)=>{
  if(!req.file)return res.status(400).json({message:'Image required'});
  const base=(process.env.PUBLIC_BASE_URL||`${req.protocol}://${req.get('host')}`).replace(/\/$/,'');
  res.status(201).json({url:`${base}/uploads/${req.file.filename}`});
};
