import Button from '@mui/material/Button';
import { useEffect,useState } from 'react';
import './authenticate.css'
import {useNavigate,Link} from 'react-router-dom'
import { useAuth } from './Authcontext';
import MenuIcon from '@mui/icons-material/Menu';
export default function Autheticate(){
    const [isLogged,setIsLogged]=useState(false);
    const navigate=useNavigate();
    const {logout}=useAuth();
    const [menu,setMenu]=useState(false);

    //Menu Function
    function showMenu(){
        setMenu((pre)=>!pre);
    }

    //Logout function
       function logoutBtn(){
       logout();
       navigate('/',{state:{message:'You are Logged Out !'}})
    }

    useEffect(()=>{
        const token=localStorage.getItem('token');
    setIsLogged(!!token);
    })
 

    return (
           <>
           <MenuIcon className='menu' onClick={showMenu} />
          {menu && <div className='auth'>
            <Link className='link' to='/'>Home</Link>
            {!isLogged && (
                <>
            <Link className='link' to='/signup'>Signup</Link>
              <Link className='link' to='/login'>Login</Link>
              </>
            )}
            {isLogged && (
                <>
                <a className='link' onClick={logoutBtn} >Log out</a>
                </>
            )}
            </div>

        }

            {!isLogged && ( 
            <div className='Auhenticate1'>
             <Button variant="contained" size='small' onClick={()=>navigate('/signup')}>SignUp</Button>
            <Button variant="contained" size='small' onClick={()=>navigate('/login')}>Login</Button>
       </div>
        )}
        {isLogged && (
             <div className='Auhenticate2'>
             <Button variant="contained" size='small' className="logout" onClick={logoutBtn}>Log out</Button>
       </div>
       ) }
       </>     
    )
}