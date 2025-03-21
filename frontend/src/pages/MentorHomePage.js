import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuComponent from "../components/MenuComponent";
import { useNavigate } from "react-router-dom";

const MentorHomepage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState([]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const handleDateChange = (date) => {
    setSelectedDay(date);
    const filtered = logs.filter((log) => {
      const logDate = new Date(log.date).toISOString().split("T")[0];
      return logDate === date; // Match the log's date to the selected day
    });
    console.log(filtered);
    setFilteredLogs(filtered);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get current day (0 = Sunday, 1 = Monday, etc.)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Set to last Sunday
    const week = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);

      let dayName;
      switch (i) {
        case 0:
          dayName = "SUN";
          break;
        case 1:
          dayName = "MON";
          break;
        case 2:
          dayName = "TUE";
          break;
        case 3:
          dayName = "WED";
          break;
        case 4:
          dayName = "THU";
          break;
        case 5:
          dayName = "FRI";
          break;
        default:
          dayName = "SAT";
          break;
      }
      week.push({
        number: day.toISOString().split("T")[0].substring(8),
        date: day.toISOString().split("T")[0],
        day: dayName,
      }); // Format to YYYY-MM-DD
    }

    handleDateChange(week[0].date); // Set the initial selected day to the first day of the week
    setWeekDates(week); // Set the dates for the current week
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const mentorID = currentUser?.id;
    fetch(`${process.env.REACT_APP_BACKEND}/get/mentor_logs/${mentorID}`)
      .then((response) => response.json())
      .then((data) => {
        setLogs(data.logs);
        setLoading(false);
        getWeekDates();
      })
      .catch((error) => {
        console.error("Error fetching mentor logs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#F6F9FF",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
          padding: 2,
          borderBottom: "1px solid #eee",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            sx={{ margin: 0, padding: 0 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
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

      {/* Main Content */}
      <Box sx={{ padding: 2.5 }}>
        {/* Greeting Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,

            // TODO: figure out how to make entire greeting section white
            // backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#e6f7f7",
              }}
            >
              <CalendarTodayIcon sx={{ color: "#57C5CC" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, marginBottom: 0.5 }}
              >
                Hi, <span style={{ color: "#57C5CC" }}>Josie</span>
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Let's log those hours!
              </Typography>
            </Box>
          </Box>
          <IconButton
            sx={{
              border: "1px solid #ddd",
              borderRadius: "50%",
              padding: 1,
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Date Selector */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            marginBottom: 3,
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {weekDates.map((day) => (
            <Button
              key={day.number}
              onClick={() => handleDateChange(day.date)}
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 48,
                height: 64,
                borderRadius: 3,
                border: "1px solid #eee",
                padding: 1,
                backgroundColor:
                  selectedDay === day.date ? "#57C5CC" : "transparent",
                color: selectedDay === day.date ? "white" : "inherit",
                "&:hover": {
                  backgroundColor:
                    selectedDay === day.date ? "#57C5CC" : "#f5f5f5",
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {day.number}
              </Typography>
              <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
                {day.day}
              </Typography>
            </Button>
          ))}
        </Box>

        {/* Log Time Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#57C5CC",
            color: "white",
            borderRadius: 2,
            padding: 1.5,
            textTransform: "none",
            fontWeight: 500,
            marginBottom: 3,
            "&:hover": {
              backgroundColor: "#7ac9c9",
            },
          }}
          onClick={() => navigate("/log-time")}
        >
          Log Time
        </Button>

        {/* Meetings List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredLogs.map((log) => (
            <Paper
              key={log.id}
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 2,
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, marginBottom: 0 }}
                >
                  {log.student_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", marginBottom: 0.5 }}
                >
                  {log.start_time.substring(0, 5)} -
                  {log.end_time.substring(0, 5)} | {log.date.substring(0, 10)}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {log.meeting_circumstance && (
                    <Chip
                      label={log.meeting_circumstance}
                      size="small"
                      sx={{
                        backgroundColor: "#57C5CC",
                        color: "#000000",
                        fontSize: 12,
                        height: 24,
                      }}
                    />
                  )}
                  {log.activity && (
                    <Chip
                      label={log.activity}
                      size="small"
                      sx={{
                        backgroundColor: "#57C5CC",
                        color: "#000000",
                        fontSize: 12,
                        height: 24,
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: log.met ? "#57C5CC" : "#eee",
                  color: log.met ? "white" : "transparent",
                }}
              >
                {log.met && <CheckIcon />}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MentorHomepage;
