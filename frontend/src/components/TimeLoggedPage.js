import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Link } from "@mui/material";

const TimeLoggedPage = (props) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background:
          "linear-gradient(180deg, var(--Light-Blue, #57C5CC) 0%, var(--Dark-Blue, #21545C) 100%)",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "70%",
          height: "50%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Top box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50%",
            gap: 2,
          }}
        >
          <Box
            sx={{
              background: "#FFFFFF",
              width: 212,
              height: 153,
            }}
          ></Box>
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "#FFF",
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
            }}
            onClick={() => navigate("/login")}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 600,
                letterSpacing: -0.32,
              }}
            >
              Log More Time
            </Typography>
          </Button>
          <Link
            component={Button}
            onClick={() => navigate("/home")}
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              textTransform: "none",
              color: "rgba(255, 255, 255, 0.75)",
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
