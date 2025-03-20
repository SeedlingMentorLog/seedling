import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import ListIcon from "@mui/icons-material/List"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PeopleIcon from "@mui/icons-material/People"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import AddIcon from "@mui/icons-material/Add"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useNavigate } from "react-router-dom"

const CalendarPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeView, setActiveView] = useState("Month")

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const weekdays = ["MON", "TUE", "WED", "THE", "FRI", "SAT", "SUN"]

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []

    // Previous month days
    for (let i = 25; i <= 30; i++) {
      days.push({ day: i, type: "prev-month" })
    }

    // Current month days
    for (let i = 1; i <= 31; i++) {
      const events = []
      if (i === 10 || i === 16 || i === 25) {
        events.push("Mentor Meeting")
      }
      days.push({ day: i, type: "current", events })
    }

    // Next month days
    for (let i = 1; i <= 5; i++) {
      days.push({ day: i, type: "next-month" })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const meetings = [
    {
      id: 1,
      title: "Mentor Meeting w/ Jake",
      time: "Today 7:19 AM",
      location: "2438 Guadalupe St.",
      city: "Austin, TX",
    },
    {
      id: 2,
      title: "Mentor Meeting w/ Jessie",
      time: "March 16 | 3:00 PM",
      location: "2438 Guadalupe St.",
      city: "Austin, TX",
    },
    {
      id: 3,
      title: "Mentor Meeting w/ Jake",
      time: "March 25 | 2:00 PM",
      location: "2438 Guadalupe St.",
      city: "Austin, TX",
    },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: "#fff",
            borderBottom: "1px solid #eaeaea",
            padding: "0 16px",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Seedling
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
            }}
          />
        </Box>
      )}

      {/* Sidebar / Drawer */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#f9f9f9",
              borderRight: "1px solid #eaeaea",
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 240,
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            padding: "20px 0",
            borderRight: "1px solid #eaeaea",
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: 3,
          paddingTop: isMobile ? "80px" : 3,
          overflow: "auto",
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Calendar
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Jenna S.
                </Typography>
                <Typography variant="caption" sx={{ color: "#888" }}>
                  Admin
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          {/* Left panel - Upcoming meetings */}
          <Box
            sx={{
              width: isMobile ? "100%" : 300,
              backgroundColor: "#fff",
              borderRadius: 2,
              padding: 2.5,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              marginBottom: isMobile ? 3 : 0,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#57C5CC",
                color: "white",
                borderRadius: 2,
                padding: 1.5,
                textTransform: "none",
                fontWeight: 500,
                marginBottom: 2.5,
                // "&:hover": {
                //   backgroundColor: "#7ac9c9",
                // },
              }}
            >
              Add New Event
            </Button>

            <Typography variant="h6" sx={{ marginBottom: 2.5 }}>
              Upcoming Meetings
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {meetings.map((meeting) => (
                <Box
                  key={meeting.id}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    padding: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#eee",
                      color: "#666",
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, marginBottom: 0.5 }}>
                      {meeting.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", marginBottom: 0.5 }}>
                      {meeting.time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", marginBottom: 0.5 }}>
                      {meeting.location}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {meeting.city}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Button
                variant="text"
                fullWidth
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  borderRadius: 2,
                  padding: 1,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e5e5e5",
                  },
                }}
              >
                See More
              </Button>
            </Box>
          </Box>

          {/* Right panel - Calendar */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2.5,
                borderBottom: "1px solid #eaeaea",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? 1 : 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  cursor: "pointer",
                  order: isMobile ? 2 : 0,
                }}
              >
                Today
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  order: isMobile ? 1 : 0,
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <IconButton size="small" sx={{ color: "#666" }}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  March 2025
                </Typography>
                <IconButton size="small" sx={{ color: "#666" }}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  order: isMobile ? 3 : 0,
                  marginLeft: isMobile ? "auto" : 0,
                }}
              >
                {["Day", "Week", "Month"].map((view) => (
                  <Button
                    key={view}
                    variant="text"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      color: activeView === view ? "white" : "#666",
                      backgroundColor: activeView === view ? "#57C5CC" : "transparent",
                      "&:hover": {
                        backgroundColor: activeView === view ? "#57C5CC" : "#f0f0f0",
                      },
                    }}
                    onClick={() => setActiveView(view)}
                  >
                    {view}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  textAlign: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eaeaea",
                }}
              >
                {weekdays.map((day) => (
                  <Typography
                    key={day}
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "#666",
                    }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gridTemplateRows: "repeat(6, 1fr)",
                  borderTop: "1px solid #eaeaea",
                }}
              >
                {calendarDays.map((day, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRight: index % 7 === 6 ? "none" : "1px solid #eaeaea",
                      borderBottom: "1px solid #eaeaea",
                      padding: 1,
                      position: "relative",
                      minHeight: isMobile ? 60 : 80,
                      color: day.type !== "current" ? "#ccc" : "inherit",
                    }}
                  >
                    {day.day}
                    {day.events &&
                      day.events.map((event, eventIndex) => (
                        <Box
                          key={eventIndex}
                          sx={{
                            backgroundColor: "#e6f7f7",
                            color: "#57C5CC",
                            fontSize: isMobile ? 10 : 12,
                            padding: isMobile ? "2px 4px" : "4px 8px",
                            borderRadius: 1,
                            marginTop: 1,
                            borderLeft: "3px solid #57C5CC",
                          }}
                        >
                          {event}
                        </Box>
                      ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// Sidebar content component
const SidebarContent = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: <HomeIcon />, text: "Home" },
    { icon: <ListIcon />, text: "Lists" },
    { icon: <CalendarTodayIcon />, text: "Calendar", active: true },
    { icon: <FavoriteIcon />, text: "Item" },
    { icon: <FavoriteIcon />, text: "Item" },
    { icon: <FavoriteIcon />, text: "Item" },
  ]

  const pageItems = [
    { icon: <CalendarTodayIcon />, text: "Calendar" },
    { icon: <PeopleIcon />, text: "Your Matches" },
    { icon: <PersonIcon />, text: "Mentors" },
  ]

  const footerItems = [
    { icon: <SettingsIcon />, text: "Settings" },
    { icon: <LogoutIcon />, text: "Logout" },
  ]

  return (
    <>
      <Box sx={{ padding: "0 20px 20px" }}>
        <Typography variant="h6" sx={{ color: "#57C5CC", fontWeight: 500 }}>
          Seedling
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            sx={{
              padding: "10px 20px",
              backgroundColor: item.active ? "#e6f7f7" : "transparent",
              color: item.active ? "#57C5CC" : "#555",
              fontWeight: item.active ? 500 : 400,
              marginBottom: 0.5,
              "&:hover": {
                backgroundColor: item.active ? "#e6f7f7" : "#f0f0f0",
              },
            }}
            onClick={() => navigate(item.text.toLowerCase())}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: item.active ? "#57C5CC" : "#555",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <Box sx={{ padding: "20px 20px 10px" }}>
          <Typography variant="caption" sx={{ color: "#888", fontWeight: 500 }}>
            PAGES
          </Typography>
        </Box>

        {pageItems.map((item, index) => (
          <ListItem
            key={index}
            button
            sx={{
              padding: "10px 20px",
              color: "#555",
              marginBottom: 0.5,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            onClick={() => navigate(item.text.toLowerCase().replace(/\s+/g, "-"))}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#555" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {footerItems.map((item, index) => (
          <ListItem
            key={index}
            button
            sx={{
              padding: "10px 20px",
              color: "#555",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            onClick={() => navigate(item.text.toLowerCase())}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#555" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default CalendarPage

