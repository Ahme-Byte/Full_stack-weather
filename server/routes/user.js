const express=require('express');
const router=express.Router();
const controller=require('../controller/userController')


//Post Signup request
router.post('/signup',controller.pSignup);

//Get Signup Verification 
router.get('/verify/:token',controller.gSignup);

//Post login req
router.post('/login',controller.pLogin);

//Forget password 
router.post('/forget',controller.pForget);

//Verify email for forget password
router.post('/reset',controller.vForget);

module.exports=router;