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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuComponent from "../../components/MenuComponent";
import { useNavigate } from "react-router-dom";

const MentorHomepage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

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
      return logDate === date;
    });
    setFilteredLogs(filtered);
  };

  const getWeekDates = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const week = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);

      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      week.push({
        number: day.toISOString().split("T")[0].substring(8),
        date: day.toISOString().split("T")[0],
        day: dayNames[i],
      });
    }

    handleDateChange(week[0].date);
    setWeekDates(week);
  };

  useEffect(() => {
    getWeekDates();
  }, [weekOffset]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const accessToken = currentUser?.accessToken;
    const ID = currentUser?.id;
    const logsKey =
      currentUser?.role === "school contact" ? "school_logs" : "mentor_logs";
    fetch(`${process.env.REACT_APP_BACKEND}/get/${logsKey}/${ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLogs(data.logs);
        setLoading(false);
        getWeekDates();
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
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

      {/* Greeting Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2.5,
          marginBottom: 1,
          backgroundColor: "#FFFFFF",
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
              Hi,{" "}
              <span style={{ color: "#57C5CC" }}>
                {JSON.parse(localStorage.getItem("currentUser"))?.name}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Let's log those hours!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Date Selector + Arrows */}
      <Box sx={{ position: "relative", paddingTop: 4, paddingBottom: 2 }}>
        <IconButton
          onClick={() => setWeekOffset(weekOffset - 1)}
          sx={{
            position: "absolute",
            top: "50%",
            left: "1%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIosNewIcon
            sx={{ color: "#57C5CC", width: 10, height: 10 }}
          />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            marginX: "10%", // prevent arrows from overlapping
          }}
        >
          {weekDates.map((day) => (
            <Button
              key={day.date}
              onClick={() => handleDateChange(day.date)}
              sx={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "13%",
                minWidth: 32,
                height: 64,
                borderRadius: 3,
                border: "1px solid #eee",
                padding: 1,
                backgroundColor: selectedDay === day.date ? "#57C5CC" : "white",
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

        <IconButton
          onClick={() => setWeekOffset(weekOffset + 1)}
          sx={{
            position: "absolute",
            top: "50%",
            right: "1%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon
            sx={{ color: "#57C5CC", width: 10, height: 10 }}
          />
        </IconButton>
      </Box>

      {/* Log Time Button */}
      <Box sx={{ paddingX: 2.5 }}>
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
      </Box>

      {/* Meetings List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingX: 2.5,
        }}
      >
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
                sx={{
                  marginBottom: 0,
                  color: "#000",
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontStyle: "normal",
                  fontWeight: 500,
                }}
              >
                {log.student_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#AFB3B7", marginBottom: 0.5 }}
              >
                {log.start_time.substring(0, 5)} -{" "}
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
                      fontStyle: "italic",
                    }}
                  />
                )}
                {log.activity && (
                  <Chip
                    label={log.activity}
                    size="small"
                    sx={{
                      backgroundColor: "#AEF4F9",
                      color: "#000000",
                      fontSize: 12,
                      height: 24,
                      fontStyle: "italic",
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
  );
};

export default MentorHomepage;
