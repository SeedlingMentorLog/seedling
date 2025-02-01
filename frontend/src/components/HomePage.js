import React, { useState } from 'react';
import {useAuth} from '../contexts/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import Typography from '@mui/material/Typography';
import { Button, Box, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const HomePage = () => {
  const { handleGoogleSignup } = useAuth();
  const { handleGoogleSignIn } = useAuth();
  const { handleEmailPasswordSignIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSigninClick = async () => {
    try {
      await handleGoogleSignIn(setError);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleGoogleSignupClick = async () => {
    try {
      await handleGoogleSignup(setError);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      await handleEmailPasswordSignIn(email, password);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const CustomErrorMessage = ({ error, onClose }) => (
    <Box
      width="40%"
      height="50%"
      top="27%"
      left="30%"
      position="absolute"
      bgcolor="#9B9B9B"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h3" sx={{ fontSize: '100px', fontWeight: 500, textAlign: 'center', color: '#000000', marginBottom: '1rem'}}>Error!</Typography>
      <Typography variant="body1" sx={{ fontSize: '30px', fontWeight: 400, textAlign: 'center', color: '#000000', marginBottom: '1rem', marginLeft: '2rem', marginRight: '2rem'}}>Please use your utexas.edu email to log in</Typography>
    </Box>
  );

  const handleCloseError = () => {
    setError(null); // Clear the error state to hide the modal
  };
  

  return (
    <div>
          {/* Log in or sign up text */}
          <Typography
            variant="h3"
          >
            Log in or sign up
          </Typography>

          {/* Continue with Google button */}
          <GoogleButton onClick={handleGoogleSigninClick} />

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailPasswordLogin}>
            <TextField 
              label="Email" 
              variant="outlined" 
              fullWidth 
              margin="normal" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <TextField 
              label="Password" 
              variant="outlined" 
              type="password" 
              fullWidth 
              margin="normal" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type="submit" variant="contained" fullWidth>
              Log In
            </Button>
          </form>

          {error !== null && (
            <CustomErrorMessage error={error} onClose={handleCloseError} />
          )}

          {/* Text under continue with google button */}
          <Typography
            variant="h6"
          >
            Don’t have an account yet?{' '}
            <span
              onClick={handleGoogleSignupClick} // TODO: modify once backend endpoint to check if user already exists is made.
            >
              Sign up
            </span>
          </Typography>
    </div>
  );
};

export default HomePage;