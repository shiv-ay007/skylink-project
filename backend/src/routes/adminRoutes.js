import {Router} from 'express';
import {protect,authorize} from '../middleware/auth.js';
import {list,getOne,create,update,remove} from '../controllers/resourceController.js';
import {adminSettings,updateSettings} from '../controllers/publicController.js';
import dashboard from '../controllers/dashboardController.js';
import {AppError} from '../utils/api.js';
import multer from 'multer';import path from 'path';import fs from 'fs';import crypto from 'crypto';
const router=Router();
router.use(protect,authorize('admin','employee'));
router.get('/dashboard',dashboard);
router.get('/settings',adminSettings);
router.put('/settings',authorize('admin'),updateSettings);
const uploadDir=path.resolve('uploads');fs.mkdirSync(uploadDir,{recursive:true});
const upload=multer({storage:multer.diskStorage({destination:uploadDir,filename(_req,file,cb){cb(null,`${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);}}),limits:{fileSize:5*1024*1024},fileFilter(_req,file,cb){const allowed=['image/jpeg','image/png','image/webp','image/gif'];cb(null,allowed.includes(file.mimetype));}});
router.post('/upload',authorize('admin'),upload.single('image'),(req,res,next)=>{
 if(!req.file)return next(new AppError('Upload a JPEG, PNG, WEBP or GIF image (max 5MB)',400));
 const base=process.env.PUBLIC_SITE_URL?.replace(/\/$/,'')||`http://localhost:${process.env.PORT||5000}`;
 // Files are served by the API server, not by the client app.
 const apiBase=`${req.protocol}://${req.get('host')}`;
 res.status(201).json({success:true,data:{url:`${apiBase}/uploads/${req.file.filename}`}});
});
router.get('/:resource',list);router.get('/:resource/:id',getOne);
router.post('/:resource',authorize('admin'),create);
router.patch('/:resource/:id',authorize('admin'),update);
router.put('/:resource/:id',authorize('admin'),update);
router.delete('/:resource/:id',authorize('admin'),remove);
export default router;
