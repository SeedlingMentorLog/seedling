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
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TimeLogPage = (props) => {
  const [date, setDate] = useState(null);
  const [mentee, setMentee] = useState(null);
  const [comments, setComments] = useState(null);

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
            value={mentee}
            onChange={(event) => setMentee(event.target.value)}
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
          label="Comments"
          placeholder="Type the note here..."
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          fullWidth
          multiline
          minRows={3}
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            fontFamily: "Inter",
            marginBottom: 2,
          }}
        ></TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
              alignItems: "center",
              marginBottom: 2
            }}
          ></DatePicker>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default TimeLogPage;
