import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SidebarComponent from "../../components/SidebarComponent";
import HeaderComponent from "../../components/HeaderComponent";

const MemberInfoPage = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/get/users`
        );
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const getRoleStyles = (role) => {
    const baseStyle = {
      fontWeight: 400,
      color: "#222",
      fontSize: 14,
    };

    switch (role.toLowerCase()) {
      case "mentor":
        return { ...baseStyle, bgcolor: "#57C5CC47" };
      case "admin":
        return { ...baseStyle, bgcolor: "#F8F4D3" };
      case "school contact":
        return { ...baseStyle, bgcolor: "#F1963A59" };
      case "staff":
        return { ...baseStyle, bgcolor: "#EB433540" };
      default:
        return { ...baseStyle, bgcolor: "#E0E0E0" };
    }
  };

  const filtered = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        u.email.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "A-Z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const total = filtered.length;
  const start = (page - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);
  const paginated = filtered.slice(start, end);

  return (
    <Box sx={{ display: "flex", height: "100vh", fontFamily: "Poppins" }}>
      <SidebarComponent currentPage="Member Info" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <HeaderComponent />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F5F6FA" }}>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 600, fontFamily: "Nunito Sans" }}
          >
            Member Information
          </Typography>

          {/* Search and Sort */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 4 }}
              >
                <InputLabel id="sort-label" sx={{ fontFamily: "Poppins" }}>
                  Sort by
                </InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 4 }}
                  MenuProps={{ PaperProps: { sx: { fontFamily: "Poppins" } } }}
                >
                  <MenuItem value="A-Z">A - Z</MenuItem>
                  <MenuItem value="Z-A">Z - A</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#fff",
                  border: "1px solid #EDF1F7",
                  borderRadius: 4,
                  px: 1,
                }}
              >
                <SearchIcon sx={{ color: "#999" }} />
                <TextField
                  variant="standard"
                  placeholder="Search by name..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    sx: { ml: 1, fontSize: 14, fontFamily: "Poppins" },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, bgcolor: "#fff" }}
          >
            <Table sx={{ fontFamily: "Poppins" }}>
              <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((user, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} sx={getRoleStyles(user.role)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(total / rowsPerPage)}
              page={page}
              onChange={(_, val) => setPage(val)}
              shape="rounded"
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MemberInfoPage;