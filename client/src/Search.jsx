import './Search.css'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react"
import { useNavigate } from 'react-router-dom';
export default function Search({setWeatherData}){
     const [city,setCity]=useState("");
    const apiKey=import.meta.env.VITE_WEATHER_API_KEY;
    const api="https://api.openweathermap.org/data/2.5/weather";
        const navigate=useNavigate();


//Searching Function
    function searching(evt){
        setCity(evt.target.value)
    }

//Find Weather Data
     const weather= async ()=>{
        const token=localStorage.getItem('token');
        if(!token){
           return navigate('/login',{state:{message:'You must be Login First'}});
        }
        try{
          let result=  await fetch(`${api}?q=${city}&appid=${apiKey}&units=metric`);
          let final_result=await result.json();
          if(final_result.cod !== 200){
             setWeatherData({Error:`No Data Found For ${city}`});
             return;
          }
          setWeatherData(final_result);
  } catch(e){
     setWeatherData({Error:`Something Went Wrong ${e.message}`});
    
}
}

//Prevent Default
      function preDef(evt){
       evt.preventDefault();
       setCity("");
      }
    return (
        <form className="s_form" onSubmit={preDef}>
            <TextField  label="City Name" variant="standard" className="search" value={city} onChange={searching}/>
            <IconButton className="s_btn" onClick={weather} disableRipple>
             &nbsp;&nbsp;
            <SearchIcon color="primary" className="s_icon"/>
            </IconButton>
       </form>
    )
}