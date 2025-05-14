import { Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People"; // NEW icon for Member Info
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import { useTheme, useMediaQuery } from "@mui/material";

const SidebarComponentSchoolContact = ({ currentPage }) => {
  const { handleSignOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true if <= 600px

  const navItems = [
    { label: "Dashboard", icon: <HomeIcon />, key: "Dashboard", path: "/school-contact-dashboard" },
    { label: "Mentor Logs", icon: <AccessTimeIcon />, key: "Mentor Logs", path: "/school-contact-mentor-logs" },
    // { label: "Member Info", icon: <PeopleIcon />, key: "Member Info", path: "/school-contact-member-info" },
    // { label: "Your Matches", icon: <GroupsIcon />, key: "Your Matches", path: "/matches" },
    // { label: "Mentors", icon: <CalendarMonthIcon />, key: "Mentors", path: "/mentors" },
  ];

  const getListItemTextStyles = (isSelected) => ({
    ml: 1,
    display: isMobile ? "none" : "block", // Hide text on mobile
    span: {
      color: isSelected ? "#FFF" : "#202224",
      fontFamily: "Nunito Sans",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 600,
    },
  });

  return (
    <Box
      sx={{
        width: isMobile ? "20%" : "13%",
        bgcolor: "#fff",
        borderRight: "1px solid #E0E0E0",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Nunito Sans",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <List>
          {navItems.map(({ label, icon, key, path }) => {
            const isSelected = currentPage === label;
            return (
              <ListItem
                key={key}
                button
                onClick={() => navigate(path)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#57C5CC" : "transparent",
                  color: isSelected ? "#FFF" : "inherit",
                  borderRadius: 1,
                  mb: 1,
                  justifyContent: isMobile ? "center" : "flex-start",
                  "&:hover": {
                    backgroundColor: isSelected ? "#57C5CC" : "#F0F0F0",
                  },
                }}
              >
                {icon}
                <ListItemText sx={getListItemTextStyles(isSelected)} primary={label} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Divider sx={{ my: 1 }} />
        <List>
          <ListItem
            button
            onClick={handleSignOut}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#F0F0F0" },
              borderRadius: 1,
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <LogoutIcon sx={{ mr: isMobile ? 0 : 1 }} />
            <ListItemText sx={getListItemTextStyles(false)} primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default SidebarComponentSchoolContact;
