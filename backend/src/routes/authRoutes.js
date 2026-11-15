import {Router} from 'express';
import {register,registerAdmin,login,googleLogin,me,updateMe} from '../controllers/authController.js';
import {protect} from '../middleware/auth.js';
import {validate,schemas} from '../middleware/validate.js';
const router=Router();
router.post('/register',validate(schemas.register),register);router.post('/admin-register',validate(schemas.adminRegister),registerAdmin);router.post('/login',validate(schemas.login),login);
router.post('/google',validate(schemas.google),googleLogin);
router.get('/me',protect,me);router.patch('/me',protect,updateMe);
export default router;
