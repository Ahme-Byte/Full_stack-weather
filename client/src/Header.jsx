import "./header.css"
import Search from './Search'
import Authenticate from './Authenticate'
import StormIcon from '@mui/icons-material/Storm';
import { useNavigate } from "react-router-dom";

export default function Header({setWeatherData}){
    const navigate=useNavigate();
    return(
    <header className="header">
        <div className="web_icon_div" onClick={()=>navigate('/')}>
        <StormIcon className="web_icon"/>
        <h3 className="web_title">Weather Update</h3>
        </div>
        <div className="header2">
        <Search setWeatherData={setWeatherData}/>
       <Authenticate/>
       </div>
    </header>
    )
}