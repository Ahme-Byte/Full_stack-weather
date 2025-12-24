const userSchema=require('../joi.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const User = require('../userSchema.js');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


//post signup
module.exports.pSignup=async(req,res,next)=>{
try{
  //joi Validtion
      let {error,value}=userSchema.validate(req.body);
      if(error){
        return next({status:400,message:error.details[0].message})
      };
      const {username,email,password}=value.userData;

      //User alreday exists?
      const exists=await User.findOne({email});
      if (exists){
        if(exists.isVerified){
        return next({status:400,message:'Email Already Exists'})
      }else{
        return next({status:400,message:'Please verify Your Email'});
      }
    }

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
      process.env.VERIFY_TOKEN,
      {expiresIn:'1h'}
      )
      
const link = `${process.env.WEB_URL}/user/verify/${token}`;

      //Email sender setup
      const transporter=nodemailer.createTransport({
        from:process.env.EMAIL_USER,
         host: process.env.EMAIL_HOST,  // lowercase 'process'
          port: 587,
          secure: false,
  auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS
  },
  logger:true,
  debug:true,
  connectionTimeout:10000
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
  console.log('signup err',err);
  next({status:500,message:err.message})
}
}

//get signup
module.exports.gSignup=async(req,res,next)=>{
  try{
  const data=jwt.verify(req.params.token,process.env.VERIFY_TOKEN);
  await User.findByIdAndUpdate(data.id,{isVerified:true});
 res.redirect(`${process.env.WEB_URL}/verified`);
}catch(err){
   next({status:400,message:'Invalid or Expired Token'});
}
}

//post login
module.exports.pLogin=async(req,res,next)=>{
  try{
  const {email,password}=req.body;
  const guser=await User.findOne({email});
  if(!guser){
    return next({status:400,message:'Email Not Found'});
  }
  if(!guser.isVerified){
    return next({status:400,message:'Please Verify Your Email'});
  }
  const match=await bcrypt.compare(password,guser.password);
  if(!match){
    return next({status:400,message:'Incorrect Password'});
  }
  const token=jwt.sign({
    id:guser._id
  },
  process.env.LOGIN_TOKEN,
  {expiresIn:'7d'}
);
const user={
    id:guser._id,
    username:guser.username,
    email:guser.email
}
res.status(200).json({success:true,message:'Login Successfull',token,user})
  }catch(err){
    next({status:500,message:'Something went wrong! Try again later'})
  }
}

//Post forget email
module.exports.pForget=async (req,res,next)=>{
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
    process.env.FORGET_TOKEN,
   {expiresIn:'1h'}
   )
   const fLink=`${process.env.WEB_URL}/reset/${token}`;
   const transporter=nodemailer.createTransport({
           host: process.env.EMAIL_HOST,  // lowercase 'process'
          port: 587,
          secure: false,
  auth: {
         user: process.env.EMAIL_USER,
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
}

//verify forget password
module.exports.vForget=async(req,res,next)=>{
  try{
    const {password,token}=req.body;
   const data=jwt.verify(token,process.env.FORGET_TOKEN);
   const hashed=await bcrypt.hash(password,10);
  const user= await User.findByIdAndUpdate(data.id,{password:hashed},{new:true});
  if(!user){
    return next({status:404,message:'User Not Found'});
  }
   res.status(200).json({success:true});
  }catch(err){
    next({status:400,message:'Invalid or Expired Token'});
  }
}

