import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Link } from "@mui/material";
import CardComponent from "../components/CardComponent";

const YourMatchPage = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background:
          "linear-gradient(180deg, var(--Dark-Blue, #21545C) 0%, var(--Light-Blue, #57C5CC) 100%)",
        padding: 2,
      }}
    >
      <CardComponent
        name="Juan Zamarron"
        matchSince="1/2/23"
        school="Lawler Middle School"
        birthday="1/1/2010"
      />
    </Box>
  );
};

export default YourMatchPage;
