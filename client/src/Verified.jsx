import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import './verified.css'
export default function Verified(){
    return(
        <div className='verified-container'>
        <h1 className="verified-message">
        Your Email Verified Successfully <DoneOutlineIcon className="verified-icon" />
      </h1>
      <p className="verified-subtext">You can now login and enjoy all features!</p>
        </div>
    )
}