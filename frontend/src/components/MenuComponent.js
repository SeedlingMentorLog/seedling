// MenuDrawer.jsx
import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";

const MenuComponent = ({ open, onClose, onNavigate }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 250,
          padding: 1,
        }}
        role="presentation"
      >
        {/* Close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 1,
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Items */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavigate("/")}>
              <ListItemIcon>
                <HomeIcon color="primary" sx={{ color: "#57C5CC" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 600,
                    letterSpacing: -0.32,
                  }}
                >
                  Homepage
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavigate("/log-time")}>
              <ListItemIcon>
                <AccessTimeIcon sx={{ color: "#57C5CC" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 600,
                    letterSpacing: -0.32,
                  }}
                >
                  Log Hours
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavigate("/your-match")}>
              <ListItemIcon>
                <GroupIcon color="primary" sx={{ color: "#57C5CC" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 600,
                    letterSpacing: -0.32,
                  }}
                >
                  Your Match
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavigate("/calendar")}>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" sx={{ color: "#57C5CC" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 600,
                    letterSpacing: -0.32,
                  }}
                >
                  Calendar
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavigate("/logout")}>
              <ListItemIcon>
                <ExitToAppIcon color="primary" sx={{ color: "#57C5CC" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    color: "#000",
                    textAlign: "left",
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 600,
                    letterSpacing: -0.32,
                  }}
                >
                  Log Out
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default MenuComponent;
