import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import CardComponent from "../../components/CardComponent";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuComponent from "../../components/MenuComponent";

const YourMatchPage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false);
    navigate(path);
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
        setStudents(data.students);
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
        backgroundColor: "#57C5CC",
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
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <IconButton
            sx={{ margin: 0, padding: 0, paddingRight: 1 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography
            sx={{
              color: "white",
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
        <AccountCircleIcon sx={{ color: "white" }} />
      </Box>

      <MenuComponent
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onNavigate={handleNavigation}
      />

      {students.map((student) => (
        <CardComponent
          key={student.id}
          name={student.student_name}
          school={student.student_school}
          birthday={student.student_birthday.substring(0, 10)}
        />
      ))}
    </Box>
  );
};

export default YourMatchPage;
