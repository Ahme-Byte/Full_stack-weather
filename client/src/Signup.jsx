import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useState} from 'react'
import './signup.css'
import {Link} from 'react-router-dom'
export default function Signup(){
const [value,setValue]=useState({userData:{username:'',email:'',password:''}});
const [cpass,setCpass]=useState('');
const [msg,setMsg]=useState('');
const url='http://localhost:8080/user/signup';

//Edit form
function editing(evt){
    setValue(preValue=>({...preValue,userData:{...preValue.userData,[evt.target.name]:evt.target.value}}));
}

function cPass(evt){
    setCpass(evt.target.value);
}

//Prevnet Default submit form
 async function preDef(evt){
  evt.preventDefault();
  if(value.userData.password!==cpass){
    return setMsg('Password Does Not Match!');
  }
  try{
   const result= await fetch(url,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(value)
    });
    const f_result=await result.json();
    setMsg(f_result.message);
    }catch(err){
    setMsg("Something went wrong!")
  }}
    return(
        <>
            <h1 className='signup'>Sign Up</h1>
            <form onSubmit={preDef} className='s-form'>
      <TextField  label="Username" variant="standard"  value={value.userData.username} name="username" onChange={editing} className='inputField'/>
      <br/>
              <TextField  type="email" label="Email" variant="standard"  value={value.userData.email} name="email" onChange={editing} className='inputField'/>
                <br/>
              <TextField type="password" label="Password" variant="standard"  value={value.userData.password} name="password" onChange={editing} className='inputField'/>
              <br/>
                <TextField type="password" label="Confirm Password" variant="standard"  value={cpass} name="cpassword" onChange={cPass} className='inputField'/>
    <br/>
                <Button variant="contained" size='small' type="submit" className='s-btn'>Register</Button>
              <br/>
                 <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
                {msg && <p className='s_error'>{msg}</p> }
         </form>
          </>
    )
}