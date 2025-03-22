import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Link } from "@mui/material";

const CardComponent = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "95%",
        height: "20%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 5,
        background: "#FFF",
        boxShadow: "0px 8px 7.6px 1px rgba(0, 0, 0, 0.25)",
        marginBottom: 2,
        paddingBottom: 1,
      }}
    >
      <Typography
        sx={{
          color: "#000",
          fontFamily: "Inter",
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          paddingTop: 4,
          paddingBottom: 2,
        }}
      >
        {props.name}
      </Typography>
      <Box
        sx={{
          width: 325,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: 110,
            height: 36,
            padding: "10 24",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            borderRadius: 10,
            background: "#AEF4F9",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Inter",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            School
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "var(--Dark-Grey, #423C47);",
            fontFamily: "Inter",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          {props.school}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 325,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: 110,
            height: 36,
            padding: "10 24",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            borderRadius: 10,
            background: "#AEF4F9",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Inter",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            Birthday
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "var(--Dark-Grey, #423C47);",
            fontFamily: "Inter",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          {props.birthday}
        </Typography>
      </Box>
    </Box>
  );
};

export default CardComponent;
