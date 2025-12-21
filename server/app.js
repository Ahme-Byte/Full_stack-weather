const express=require ('express');
const app=express();
const cors=require('cors')
const mongoose=require('mongoose');
const userRouter=require('./routes/user');
const user=require('./userSchema.js');
const dotenv=require('dotenv');
dotenv.config();

//CORS Config
app.use(cors({
    origin:'http://localhost:5173',
    methods:['POST',"PUT","DELETE"],
    credentials:true
}))

//Middlewires for req data
app.use(express.urlencoded({extended:true}))
app.use(express.json());

//Api Path
app.use('/user',userRouter);

//Connecting Mongodb
main()
.then((r)=>{
    console.log("Database connected");
}).catch((e)=>{
    console.log(e.message);
})

 async function main(){
 await mongoose.connect(process.env.MONGODB_URL);
}

//Error Handling
app.use((err,req,res,next)=>{
      let {status=500,message='Something Went Wrong'}=err;
      res.status(status).json({
        success:false,
        message
    });
})

//Port Listining 
app.listen(8080,()=>{
    console.log('Port is Listining on 8080');
})