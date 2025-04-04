import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Typography from "@mui/material/Typography";
import { Button, Box, TextField } from "@mui/material";

const ForgotPasswordPage = (props) => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await resetPassword(email);
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
        <form onSubmit={handleResetPassword}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Inter",
              fontSize: 14,
              fontWeight: 400,
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
          <Button
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
              fontFamily: "Inter",
            }}
          >
            Send Reset Email
          </Button>
        </form>
        <Button
          fullWidth
          sx={{
            backgroundColor: "#57C5CC",
            color: "white",
            borderRadius: 8,
            padding: 1,
            textTransform: "none",
            fontFamily: "Inter",
          }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
