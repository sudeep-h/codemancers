const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const {protect}=require('../middlewares/authMiddleware');

router.post('/register',authController.registerUser);

router.post('/login',authController.loginUser);

router.get('/logout',authController.logoutUser);

router.get('/profile',protect,authController.getProfile);

module.exports=router;
