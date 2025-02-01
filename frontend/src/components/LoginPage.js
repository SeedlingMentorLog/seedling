import React, {useState} from 'react';
import {useAuth} from './AuthContext.js';
import {useNavigate} from 'react-router-dom';
import GoogleButton from 'react-google-button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import { Button, Box, TextField } from '@mui/material';

function LoginPage() {
    const {handleGoogleSignIn} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleGoogleLogin = async() => {
        try {
            await handleGoogleSignIn(setError);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                component="form"
                flexDirection="column"
                sx={{
                '& > :not(style)': { m: 1, width: '50ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                <Typography align="center" variant="h3" component="h2">
                    Login Page
                </Typography>
                </div>
                <GoogleButton onClick={handleGoogleLogin}/>
                {error !== null && (
                <Alert severity="error">
                    <AlertTitle>{error.errorHeader}</AlertTitle>
                    {error.errorMessage}
                </Alert>
                )}
            </Box>
        </div>
    );
}

export default LoginPage;