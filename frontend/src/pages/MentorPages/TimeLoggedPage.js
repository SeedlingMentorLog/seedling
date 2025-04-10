import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Link, IconButton } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import MenuComponent from "../../components/MenuComponent";

const TimeLoggedPage = (props) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#57C5CC",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "90%",
          height: "90%",
          position: "absolute",
        }}
      >
        <IconButton sx={{ margin: 0, padding: 0 }} onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <AccountCircleIcon sx={{ color: "white" }} />
      </Box>

      <MenuComponent
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onNavigate={handleNavigation}
      />

      <Box
        sx={{
          display: "flex",
          width: "80%",
          height: "45%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          bgcolor: "#FFF",
          borderRadius: 6,
        }}
      >
        {/* Top box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              background: "white",
              width: 120,
              height: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <VerifiedIcon
              sx={{
                fontSize: 128,
                color: "#57C5CC",
              }}
            />
          </Box>
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "#000",
              fontFamily: "Inter",
              fontSize: 32,
              fontStyle: "normal",
              fontWeight: 600,
            }}
          >
            Time Logged!
          </Typography>
        </Box>

        {/* Bottom box */}
        <Box
          sx={{
            display: "flex",
            width: 191,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            sx={{
              display: "flex",
              height: 44,
              padding: "14 48",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              alignSelf: "stretch",
              borderRadius: 100,
              background: "#57C5CC",
              boxShadow: "0px 5px 15px 0px rgba(33, 84, 92, 0.25)",
              textTransform: "none",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 600,
              letterSpacing: -0.32,
            }}
            onClick={() => navigate("/log-time")}
          >
            Log More Time
          </Button>
          <Link
            component={Button}
            onClick={() => navigate("/mentor-homepage")}
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              textTransform: "none",
              color: "#000",
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              textDecorationStyle: "solid",
              textDecorationSkipInk: "auto",
              textDecorationThickness: "auto",
            }}
          >
            Back to Homepage
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeLoggedPage;
