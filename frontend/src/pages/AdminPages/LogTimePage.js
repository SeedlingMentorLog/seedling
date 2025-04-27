import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SidebarComponentAdmin from "../../components/SidebarComponentAdmin";
import HeaderComponent from "../../components/HeaderComponent";

const LogTimePage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [activity, setActivity] = useState("");
  const [person, setPerson] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [metStatus, setMetStatus] = useState("");
  const [error, setError] = useState(null);

  const handleActivityChange = (event) => {
    setActivity(event.target.value);
    if (event.target.value !== "Other") {
      setCustomActivity("");
    }
  };

  const handlePersonChange = (event) => {
    setPerson(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const calculateHours = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    let diffInMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (diffInMinutes < 0) diffInMinutes += 24 * 60;
    return diffInMinutes / 60;
  };

  const handleSubmit = async () => {
    const missingPerson = !person;
    const missingFullDetails = !activity || !date || !startTime || !endTime;

    if (
      !metStatus ||
      (metStatus === "met" && (missingPerson || missingFullDetails)) ||
      (metStatus !== "met" && missingPerson)
    ) {
      setError({ errorMessage: "Please fill in all required fields." });
      return;
    }

    const data = {
      mentor_id: JSON.parse(person).mentor_id,
      mentor_to_student_id: JSON.parse(person).mentor_to_student_id,
      date: metStatus === "met" ? date : null,
      start_time: metStatus === "met" ? startTime : null,
      end_time: metStatus === "met" ? endTime : null,
      hours_logged: metStatus === "met" ? calculateHours(startTime, endTime) : null,
      activity: activity === "Other" ? customActivity : activity,
      meeting_circumstance: metStatus,
      comments: note,
    };

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const accessToken = currentUser?.accessToken;
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/post/add_log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log("Log added successfully");
        navigate("/admin-dashboard");
      } else {
        const errorData = await response.json();
        setError({ errorMessage: errorData.error || "Something went wrong!" });
      }
    } catch (error) {
      console.error("Error:", error);
      setError({ errorMessage: "Network error, please try again later." });
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const accessToken = currentUser?.accessToken;
        const mentorID = currentUser?.id;
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/get/students/${mentorID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", fontFamily: "Poppins" }}>
      <SidebarComponentAdmin currentPage="Log Time" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <HeaderComponent />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F5F6FA" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, fontFamily: "Nunito Sans" }}>
            Add Time
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            {/* Person Dropdown */}
            <FormControl fullWidth>
              <Select
                value={person}
                onChange={handlePersonChange}
                displayEmpty
                inputProps={{ "aria-label": "Person" }}
                sx={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 2,
                  border: "1px solid #EDF1F7",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem value="" disabled>Select a student</MenuItem>
                {students.map((student) => (
                  <MenuItem
                    key={student.mentor_to_student_id}
                    value={JSON.stringify(student)}
                  >
                    {student.student_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Did you meet with student? */}
            <FormControl component="fieldset">
              <RadioGroup
                value={metStatus}
                onChange={(e) => setMetStatus(e.target.value)}
                sx={{ paddingTop: 1 }}
              >
                <FormControlLabel
                  value="met"
                  control={<Radio />}
                  label="Met with student"
                />
                <FormControlLabel
                  value="no-show"
                  control={<Radio />}
                  label="Student did not show up"
                />
                <FormControlLabel
                  value="not-met"
                  control={<Radio />}
                  label="Did not meet with student"
                />
              </RadioGroup>
            </FormControl>

            {/* Conditional fields if "met" */}
            {metStatus === "met" && (
              <>
                <TextField
                  type="date"
                  fullWidth
                  value={date}
                  onChange={handleDateChange}
                  sx={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    fullWidth
                    sx={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  />
                  <TextField
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    fullWidth
                    sx={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  />
                </Box>

                <FormControl fullWidth>
                  <Select
                    value={activity}
                    onChange={handleActivityChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Activity" }}
                    sx={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 2,
                      border: "1px solid #EDF1F7",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem value="" disabled>Select an activity</MenuItem>
                    <MenuItem value="Talked">Talked</MenuItem>
                    <MenuItem value="Played games">Played Games</MenuItem>
                    <MenuItem value="Did art projects">Did Art Projects</MenuItem>
                    <MenuItem value="Read">Read</MenuItem>
                    <MenuItem value="Played sports">Played Sports</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {activity === "Other" && (
                    <TextField
                      fullWidth
                      placeholder="Describe the activity"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      variant="outlined"
                      sx={{
                        mt: 2,
                        backgroundColor: "#F9FAFB",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    />
                  )}
                </FormControl>
              </>
            )}

            {/* Note Input */}
            <TextField
              placeholder="Type the note here..."
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={handleNoteChange}
              variant="outlined"
              sx={{
                backgroundColor: "#F9FAFB",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              fullWidth
              sx={{
                backgroundColor: "#57C5CC",
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 2,
                padding: "10px 0",
                textTransform: "none",
              }}
            >
              Submit
            </Button>
          </Box>

          {/* Error Popup */}
          {error && (
            <Paper
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: "#FDE4E4",
                borderRadius: 2,
                textAlign: "center",
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={handleCloseError}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="body1" sx={{ fontFamily: "Inter", fontWeight: 500 }}>
                {error.errorMessage}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LogTimePage;