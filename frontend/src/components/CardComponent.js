import { React } from "react";
import { Box, Typography } from "@mui/material";

const CardComponent = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "95%",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 5,
        background: "#FFF",
        boxShadow: "0px 8px 7.6px 1px rgba(0, 0, 0, 0.25)",
        marginBottom: 2,
        paddingBottom: 2,
        paddingTop: 2,
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
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        {props.name}
      </Typography>

      {/* This container handles School and Birthday */}
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // ⬅️ KEY: stacked on mobile, side-by-side on desktop
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* School */}
        <Box
          sx={{
            display: "flex",
            width: 110,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            background: "#AEF4F9",
            marginBottom: { xs: 1, md: 0 }, // ⬅️ margin below only on mobile
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Inter",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            School
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#423C47",
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {props.school}
        </Typography>

        {/* Birthday */}
        <Box
          sx={{
            display: "flex",
            width: 110,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            background: "#AEF4F9",
            marginTop: { xs: 1, md: 0 }, // ⬅️ margin top only on mobile
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Inter",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Birthday
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#423C47",
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {props.birthday}
        </Typography>
      </Box>
    </Box>
  );
};

export default CardComponent;
