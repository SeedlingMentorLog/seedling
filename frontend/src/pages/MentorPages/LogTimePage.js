import { act, React, useEffect, useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuComponent from "../../components/MenuComponent";
import CloseIcon from "@mui/icons-material/Close";

const LogTimePage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

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
    // Split the time strings into hours and minutes
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Convert start and end times into minutes from midnight
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Calculate the difference in minutes
    let diffInMinutes = endTotalMinutes - startTotalMinutes;

    // If the end time is earlier than the start time (crossing midnight), adjust the difference
    if (diffInMinutes < 0) {
      diffInMinutes += 24 * 60;
    }

    // Convert minutes into hours (with decimal)
    const hoursLogged = diffInMinutes / 60;
    return hoursLogged;
  };

  // Add a log to the database
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
      hours_logged:
        metStatus === "met" ? calculateHours(startTime, endTime) : null,
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
        navigate("/time-logged");
      } else {
        const errorData = await response.json();
        setError({ errorMessage: errorData.error || "Something went wrong!" });
      }
    } catch (error) {
      console.error("Error:", error);
      setError({ errorMessage: "Network error, please try again later." });
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component loads
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
        setStudents(data.students); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#FFF",
        padding: 2,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <IconButton
            sx={{ margin: 0, padding: 0, paddingRight: 1 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: "#000" }} />
          </IconButton>
          <Typography
            sx={{
              color: "#222B45",
              fontFamily: "Inter",
              fontSize: 20,
              fontStyle: "normal",
              fontWeight: 590,
              lineHeight: "normal",
              letterSpacing: -0.4,
            }}
          >
            Seedling
          </Typography>
        </Box>
        <AccountCircleIcon sx={{ color: "#57C5CC" }} />
      </Box>

      <MenuComponent
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onNavigate={handleNavigation}
      />

      {/* Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "85%",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 24,
            fontWeight: 600,
            textAlign: "center",
            color: "#000",
          }}
        >
          Add Time
        </Typography>

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
            <MenuItem value="" disabled>
              Select a student
            </MenuItem>
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

        {/* Conditional Fields */}
        {metStatus === "met" && (
          <>
            {/* Date */}
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

            {/* Start and End Time */}
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

            {/* Activity Selector - no label now */}
            <FormControl component="fieldset">
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
                <MenuItem value="" disabled>
                  Select an activity
                </MenuItem>
                <MenuItem value="talked">Talked</MenuItem>
                <MenuItem value="played games">Played Games</MenuItem>
                <MenuItem value="did art projects">Did Art Projects</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="Played sports">Played sports</MenuItem>
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
                    border: "1px solid #EDF1F7",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                />
              )}
            </FormControl>
          </>
        )}

        {/* Note Input - always at the bottom */}
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
            border: "1px solid #EDF1F7",
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

export default LogTimePage;
