import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Button, Box, TextField, Link } from "@mui/material";

const SignupPage = () => {
  const {
    handleGoogleSignup,
    handleEmailPasswordSignup,
    setError,
    setShowError,
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignupClick = async () => {
    await handleGoogleSignup();
  };

  const handleEmailPasswordSignupClick = async (e) => {
    e.preventDefault();
    if (!name) {
      setError({
        errorHeader: "Missing Name",
        errorMessage: "Please enter your name.",
      });
      setShowError(true);
      return;
    }
    await handleEmailPasswordSignup(email, password, name);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#57C5CC",
        paddingX: 6,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          paddingX: 2,
          paddingY: 6,
          borderRadius: 4,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F6F8FB",
              borderRadius: "50%",
            }}
          >
            <Typography variant="h6" color="#788BA5">
              →
            </Typography>
          </Box>
        </Box>
        <Typography
          color="#181E25"
          fontFamily="Inter"
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Sign Up
        </Typography>

        <form onSubmit={handleEmailPasswordSignupClick}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Inter",
              fontSize: 14,
              color: "#181E25",
              marginBottom: 0.5,
            }}
          >
            Name
          </Typography>
          <TextField
            fontFamily="Inter"
            variant="outlined"
            fullWidth
            margin="dense"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            sx={{ marginBottom: 2 }}
          />

          <Typography
            variant="body2"
            sx={{
              fontFamily: "Inter",
              fontSize: 14,
              color: "#181E25",
              marginBottom: 0.5,
            }}
          >
            Email
          </Typography>
          <TextField
            fontFamily="Inter"
            variant="outlined"
            fullWidth
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@company.com"
            sx={{ marginBottom: 2 }}
          />

          <Typography
            variant="body2"
            sx={{
              fontFamily: "Inter",
              fontSize: 14,
              color: "#181E25",
              marginBottom: 0.5,
            }}
          >
            Password
          </Typography>
          <TextField
            fontFamily="Inter"
            variant="outlined"
            type="password"
            fullWidth
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            sx={{ marginBottom: 3 }}
          />

          <Button
            fontFamily="Inter"
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#57C5CC",
              color: "white",
              borderRadius: 8,
              padding: 1,
              textTransform: "none",
              marginBottom: 2,
            }}
          >
            Sign Up
          </Button>
        </form>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              height: 2,
              borderWidth: 1,
              backgroundColor: "#DEE4ED",
              flex: 5,
            }}
          />
          <Typography
            sx={{ fontFamily: "Inter", marginX: 1, color: "#788BA5" }}
          >
            OR
          </Typography>
          <Box
            sx={{
              height: 2,
              borderWidth: 1,
              backgroundColor: "#DEE4ED",
              flex: 5,
            }}
          />
        </Box>

        <Button
          onClick={handleGoogleSignupClick}
          fullWidth
          fontFamily="Inter"
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            borderRadius: 8,
            borderColor: "#ccc",
            backgroundColor: "white",
            color: "#333",
            textTransform: "none",
            padding: 1,
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
            marginBottom: 4,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20px"
              height="20px"
            >
              <path
                fill="#FFC107"
                d="M43.6,20.3H42V20H24v8h11.3C34.9,33.3,30.1,37,24,37c-7.2,0-13-5.8-13-13s5.8-13,13-13c3.2,0,6.2,1.2,8.5,3.3l6.4-6.4C34.3,4.1,29.4,2,24,2C11.8,2,2,11.8,2,24s9.8,22,22,22c11,0,20.3-8.1,21.9-18.7C44,25.8,43.6,22.9,43.6,20.3z"
              />
              <path
                fill="#FF3D00"
                d="M6.3,14.7l6.6,4.8C14.8,15.6,18.9,13,24,13c3.2,0,6.2,1.2,8.5,3.3l6.4-6.4C34.3,4.1,29.4,2,24,2 C14.8,2,6.9,7.8,6.3,14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.1,0,9.8-1.9,13.3-5.1l-6.6-5.4c-2.3,1.6-5.2,2.5-8.2,2.5c-6,0-11.2-3.8-13.1-9l-6.4,5.1 C6.3,37.6,14.6,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.6,20.3H42V20H24v8h11.3c-1.2,3.1-3.3,5.7-6.3,7.4l6.6,5.4c-0.6,0.5,10.6-6.3,13.3-17 C44,25.8,43.6,22.9,43.6,20.3z"
              />
            </svg>
          </Box>
          Log in with Google
        </Button>

        <Typography
          fontFamily="Inter"
          align="center"
          variant="body2"
          sx={{ marginTop: 6, color: "black" }}
        >
          Already have an account?{" "}
          <Link
            onClick={() => navigate("/login")}
            sx={{
              fontFamily: "Inter",
              cursor: "pointer",
              color: "#57C5CC",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupPage;
