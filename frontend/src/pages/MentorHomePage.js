import { useState } from "react"
import { Box, Typography, Button, IconButton, Paper, Avatar, Chip } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AddIcon from "@mui/icons-material/Add"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import CheckIcon from "@mui/icons-material/Check"
import { useNavigate } from "react-router-dom"

const MentorHomepage = () => {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState(3)

  const days = [
    { number: 3, day: "SAT" },
    { number: 4, day: "SUN" },
    { number: 5, day: "MON" },
    { number: 6, day: "TUE" },
    { number: 7, day: "WED" },
    { number: 8, day: "THU" },
    { number: 9, day: "FRI" },
  ]

  const meetings = [
    {
      id: 1,
      name: "Jonny Webster",
      time: "2:15 PM",
      location: "2348 Guadalupe St",
      tags: ["Mentoring Hours", "In-Person"],
      completed: true,
    },
    {
      id: 2,
      name: "Jessie Smith",
      time: "4:15 PM",
      location: "2348 Guadalupe St",
      tags: ["Mentoring Hours", "Virtual"],
      completed: false,
    },
  ]

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
          padding: 2,
          borderBottom: "1px solid #eee",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
            Seedling
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: "#f0f0f0",
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ padding: 2.5, }}>
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
              <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 0.5 }}>
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
          {days.map((day) => (
            <Button
              key={day.number}
              onClick={() => setSelectedDay(day.number)}
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 48,
                height: 64,
                borderRadius: 3,
                border: "1px solid #eee",
                padding: 1,
                backgroundColor: selectedDay === day.number ? "#57C5CC" : "transparent",
                color: selectedDay === day.number ? "white" : "inherit",
                "&:hover": {
                  backgroundColor: selectedDay === day.number ? "#57C5CC" : "#f5f5f5",
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
          onClick={() => navigate("/your-match")}
        >
          Log Time
        </Button>

        {/* Meetings List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {meetings.map((meeting) => (
            <Paper
              key={meeting.id}
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
                <Typography variant="subtitle1" sx={{ fontWeight: 500, marginBottom: 1 }}>
                  {meeting.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", marginBottom: 0.5 }}>
                  {meeting.time} | {meeting.location}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {meeting.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: "#57C5CC",
                        color: "#000000",
                        fontSize: 12,
                        height: 24,
                      }}
                    />
                  ))}
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
                  backgroundColor: meeting.completed ? "#57C5CC" : "#eee",
                  color: meeting.completed ? "white" : "transparent",
                }}
              >
                {meeting.completed && <CheckIcon />}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default MentorHomepage

