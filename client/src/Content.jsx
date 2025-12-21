import "./Content.css"; 
import Data from './Data';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';

export default function Content({ weatherData }) {
  const location = useLocation();
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show any message passed via navigation state (like login success)
    const message=location.state?.message;
    if(message){
      setMsg(location.state.message);
      setOpen(true);
      window.history.replaceState({}, document.title, '/');
    }
  }, [location.state]);

  return (
    <>
      {/* Snackbar Alert */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {msg}
        </Alert>
      </Snackbar>

      <div className='content'>
        <Data weatherData={weatherData}/>
      </div>
    </>
  );
}
