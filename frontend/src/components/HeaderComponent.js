import { Box, Typography } from "@mui/material";

const HeaderComponent = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userName = user?.name || "User";
  const userRole = user?.role || "Admin";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#fff",
        px: 3,
        py: 2,
        borderBottom: "1px solid #E0E0E0",
        fontFamily: "Nunito Sans",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#57C5CC",
          fontFamily: "Nunito Sans",
        }}
      >
        Seedling
      </Typography>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: "#202224",
            fontSize: 14,
            fontFamily: "Nunito Sans",
          }}
        >
          {userName}
        </Typography>
        <Typography
          sx={{
            color: "#7c7c7c",
            fontSize: 12,
            fontFamily: "Nunito Sans",
          }}
        >
          {userRole}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeaderComponent;
