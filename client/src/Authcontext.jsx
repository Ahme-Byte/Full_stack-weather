import {createContext,useContext,useState,useEffect, children} from 'react'
const AuthContext=createContext();
export default function AuthProvider({children}){
    const [userData,setUserData]=useState(null);
    useEffect(()=>{
        const token=localStorage.getItem('token');
          if(!token){
        return;
        }
    })
function login(user,token){
    localStorage.setItem('token',token);
    setUserData(user);
}
function logout(){
    localStorage.removeItem('token');
    setUserData(null);
}
    return(
        <AuthContext.Provider value={{userData,login,logout}}>
        {children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext);