import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './signup.css';
import { Link } from 'react-router-dom';
import { useAuth } from './Authcontext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';

export default function Login() {
  const [value, setValue] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState('');
  const [open, setOpen] = useState(false);

  const url = `${import.meta.env.VITE_BACKEND_DOMAIN}/user/login`;
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show any message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setAlert(location.state.message);
      setOpen(true);
      window.history.replaceState({}, document.title, '/'); // remove message from URL state
    }
  }, [location.state]);

  // Handle form input changes
  function editing(evt) {
    setValue(prev => ({ ...prev, [evt.target.name]: evt.target.value }));
  }

  // Handle form submit
  async function preDef(evt) {
    evt.preventDefault();
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });

      const f_result = await result.json();
      if(f_result.success && f_result.token){
        login(f_result.user, f_result.token);
         navigate('/', { state: { message: 'You Are Logged In' } });
      }else{
        setMsg(f_result.message);
      }
     
    } catch (err) {
      setMsg('Something went wrong!');
    }
  }

  // Handle closing the Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return; // ignore clickaway
    setOpen(false);
  };

  return (
    <>
      {/* Snackbar with Alert */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert}
        </Alert>
      </Snackbar>

      <h1 className="signup">Login</h1>
      <form onSubmit={preDef} className="s-form">
        <TextField
          type="email"
          label="Email"
          variant="standard"
          value={value.email}
          name="email"
          onChange={editing}
          className="inputField"
        />
        <br />
        <TextField
          type="password"
          label="Password"
          variant="standard"
          value={value.password}
          name="password"
          onChange={editing}
          className="inputField"
        />
        <Link to='/forget'>Forget Password?</Link>
        <Button variant="contained" size="small" type="submit" className="s-btn">
          Login
        </Button>
        <br/>
         <p>
          Don't have any Account? <Link to="/signup">Signup</Link>
        </p>
        {msg && <p className="s_error">{msg}</p>}
      </form>
    </>
  );
}
