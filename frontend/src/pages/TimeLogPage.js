import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const TimeLogPage = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "85%",
          height: "60%",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          borderRadius: 5,
          background: "#FFF",
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
            paddingBottom: 4,
          }}
        >
          Add Time
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Select Mentee</InputLabel>
          <Select
            label="Select Mentee"
            sx={{
              borderRadius: 2,
              border: "1px solid #EDF1F7",
              marginBottom: 2,
              fontFamily: "Inter",
            }}
          >
            <MenuItem value={"Juan Zamarron"}>Juan Zamarron</MenuItem>
            <MenuItem value={"Mentee #2"}>Mentee #2</MenuItem>
            <MenuItem value={"Mentee #3"}>Mentee #3</MenuItem>
          </Select>
        </FormControl>
        <TextField
          placeholder="Type the note here..."
          fullWidth
          multiline
          minRows={3}
          maxRows={3}
          sx={{ borderRadius: 2, fontFamily: "Inter" }}
        ></TextField>
      </Box>
    </Box>
  );
};

export default TimeLogPage;
