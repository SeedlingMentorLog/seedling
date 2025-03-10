import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Typography from "@mui/material/Typography";
import { Button, Box, TextField, Link } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ForgotPasswordPage = (props) => {
  const { resetPassword, error, setError } = useAuth();
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await resetPassword(email);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#DFF7FB",
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
      </Box>

      {error && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            backgroundColor: "#FDE4E4",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconButton
            aria-label="close"
            size="small"
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleCloseError}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: 20,
              fontWeight: 400,
              textAlign: "center",
              color: "#000",
            }}
          >
            {error.errorMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
