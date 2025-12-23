import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function Reset(){
    const navigate=useNavigate();
    const {token}=useParams();
    const [pass,setPass]=useState('');
    const [cPass,setCpass]=useState('');
    const [msg,setMsg]=useState('');
    function editing1(e){
        setPass(e.target.value);
    }
    function editing2(e){
        setCpass(e.target.value);
    }
async function preDef(e){
 e.preventDefault();
 if(pass!==cPass){
    return setMsg('Password Does Not Match!');
 }
 try{
 const result= await fetch(`${env.process.BACKEND_DOMAIN}/user/reset`,{
    method:'POST',
    headers:{
        'content-type':'application/json'
    },
       body: JSON.stringify({password:pass,token})
   })
   const final_result=await result.json();
   if(final_result.success){
    navigate('/',{state:{message:'Password Reset Successfully'}});
   }
}catch(e){
    setMsg('Something Went Wrong');
}
}

    return(
         <form onSubmit={preDef} className='s-form'>
                     <TextField type="password" label="New Password" variant="standard"  value={pass} name="password" onChange={editing1} className='inputField'/>
                     <br/>
                       <TextField type="password" label="Confirm Password" variant="standard"  value={cPass} name="cpassword" onChange={editing2} className='inputField'/>
           <br/>
                       <Button variant="contained" size='small' type="submit" className='s-btn'>Register</Button>
                       {msg && <p style={{color:'red'}}>{msg}</p>}
                       </form>
                      
    )
}