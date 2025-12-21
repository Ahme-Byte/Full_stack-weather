const express=require('express');
const router=express.Router();
const userSchema=require('../joi.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const User = require('../userSchema.js');
const dotenv=require('dotenv');
dotenv.config();

//Post Signup request
router.post('/signup',async(req,res,next)=>{
try{
  //joi Validtion
      let {error,value}=userSchema.validate(req.body);
      if(error){
        return next({status:400,message:error.details[0].message})
      };

      const {username,email,password}=value.userData;

      //User alreday exists?
      const exists=await User.findOne({email});
      if (exists && exists.isVerified){
        return next({status:400,message:'Email Already Exists'})
      };

      //password hashing
      const hashed=await bcrypt.hash(password,10);

      //Createing new user model
      const newUser=await User.create({
        username,
        email,
        password:hashed,
        isVerified:false
      })

      //Email verification token
      const token=jwt.sign(
        {
          id:newUser._id
        },
      process.env.EMAIL_SECRET,
      {expiresIn:'1h'}
      )
const link = `process.env.FRONTEND_DOMAIN/user/verify/${token}`;


      //Email sender setup
      const transporter=nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,        // ✅ change from 465 → 587
          secure: false,
        auth:{
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASS
        }
      })

  //Sent email verification
  await transporter.sendMail({
    to:email,
    subject:'Verify Your Account',
    html:  `<div style="font-family:Arial; padding:20px;">
      <h2>Weather Update</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${link}" 
         style="display:inline-block; padding:10px 15px; background:#4CAF50; color:white; 
         text-decoration:none; border-radius:5px; margin-top:10px;">
         Verify Email
      </a>
       <p>${link}</p>
    </div>`
  });
  res.status(201).json({
    success:true,
    message:'Verification Email Sent'
  });
}catch(err){
  next({status:500,message:'Something went wrong! Try again later'})
}
})

//Get Signup Verification 
router.get('/verify/:token',async(req,res,next)=>{
  try{
  const data=jwt.verify(req.params.token,process.env.EMAIL_SECRET);
  await User.findByIdAndUpdate(data.id,{isVerified:true});
 res.redirect('process.env.BACKEND_DOMAIN/verified');
}catch(err){
   next({status:400,message:'Invalid or Expired Token'});
}
})

//Post login req
router.post('/login',async(req,res,next)=>{
  try{
  const {email,password}=req.body;
  const user=await User.findOne({email});
  if(!user){
    return next({status:400,message:'Email Not Found'});
  }
  if(!user.isVerified){
    return next({status:400,message:'Please Verify Your Email'});
  }
  const match=await bcrypt.compare(password,user.password);
  if(!match){
    return next({status:400,message:'Incorrect Password'});
  }
  const token=jwt.sign({
    id:user._id
  },
  process.env.LOGIN_PASS,
  {expiresIn:'7d'}
);
res.status(200).json({success:true,message:'Login Successfull',token,user})
  }catch(err){
    next({status:500,message:'Something went wrong! Try again later'})
  }
})

//Forget password 
router.post('/forget',async (req,res,next)=>{
  try{
       const email=req.body.email;
   const userData=await User.findOne({email});
   if(!userData){
    return next({status:400,message:'Email Not Found!'});
   }
   if(!userData.isVerified){
    return next({status:400,message:'Please Verify Your Email First!'});
   }


   //Token for foget
   const token=jwt.sign(
    {
      id:userData._id
    },
    process.env.EMAIL_SECRET_FORGET,
   {expiresIn:'1h'}
   )
   const fLink=`process.env.BACKEND_DOMAIN/reset/${token}`;
   const transporter=nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,        // ✅ change from 465 → 587
          secure: false,
      auth:{
      user:  process.env.EMAIL,
       pass: process.env.EMAIL_PASS
      }
      })
     await transporter.sendMail({
        to:email,
        subject:"Reset Your Password",
        html: `<div style="font-family:Arial; padding:20px;">
      <h2>Weather Update</h2>
      <p>Click the button below to Reset Your Password:</p>
      <a href="${fLink}" 
         style="display:inline-block; padding:10px 15px; background:#4CAF50; color:white; 
         text-decoration:none; border-radius:5px; margin-top:10px;">
         Verify Email
      </a>
       <p style="margin-top:20px;">If the button doesn't work, copy and paste this link:</p>
      <p>${fLink}</p>
    </div>`
   })
   res.status(201).json({
    success:true,
    message:'Reset Email has been Sent'
   })
  }catch(err){
    next({status:500,message:'Something went wrong! Try again later'})
  }

})

//Verify email for forget password
router.post('/reset',async(req,res,next)=>{
  try{
    const {password,token}=req.body;
   const data=jwt.verify(token,process.env.EMAIL_SECRET_FORGET);
   const hashed=await bcrypt.hash(password,10);
  const user= await User.findByIdAndUpdate(data.id,{password:hashed},{new:true});
  if(!user){
    return next({status:404,message:'User Not Found'});
  }
   res.status(200).json({success:true});
  }catch(err){
    next({status:400,message:'Invalid or Expired Token'});
  }

})

module.exports=router;