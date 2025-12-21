import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import './forget.css'
export default function Forget(){
    const [email,setEmail]=useState('');
    const [msg,setMsg]=useState('');
    const url='http://localhost:8080/user/forget'

    function editing(e){
        setEmail(e.target.value);
    }

   async function preDef(e){
    e.preventDefault();
    try{
   const result=await fetch(url,{
        method:'POST',
        headers:{
   'content-type':'application/json'
        },
        body:JSON.stringify({email})
    });
    const final_result=await result.json();
    setMsg(final_result.message);
    }catch(e){
        setMsg('Something went wrong');
    }
    }
    return(
        <>
        <h2 className='heading'>Resset Password</h2>
        <form onSubmit={preDef} className='form'>
     <TextField  type="email" label="Email" variant="standard"  value={email} name="email" onChange={editing} className='inputField'/>
                            <br/>
       <Button variant="contained" size='small' type="submit" className='s-btn'>Submit</Button>
       <br/>
       {msg && <p class="info">{msg}</p>}
            </form>
        </>
    )
}