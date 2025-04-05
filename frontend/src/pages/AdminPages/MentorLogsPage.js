import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import SidebarComponent from "../../components/SidebarComponent";
import HeaderComponent from "../../components/HeaderComponent";

const MentorLogsPage = () => {
  const [mentorLogs, setMentorLogs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/get/mentor_logs`
        );
        const data = await response.json();
        setMentorLogs(data.logs || []);
      } catch (error) {
        console.error("Error fetching mentor logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const roundHours = (num) => Number(num).toFixed(2);

  const handleSearchChange = (event) => setSearchValue(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const handlePageChange = (event, value) => setPage(value);

  const filteredLogs = mentorLogs
    .filter((log) => {
      const lower = searchValue.toLowerCase();
      return (
        log.mentor_name.toLowerCase().includes(lower) ||
        log.student_name.toLowerCase().includes(lower) ||
        log.school_contact_name.toLowerCase().includes(lower) ||
        log.student_school.toLowerCase().includes(lower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
      return a.mentor_name.localeCompare(b.mentor_name);
    });

  const totalEntries = filteredLogs.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <Box sx={{ display: "flex", height: "100vh", fontFamily: "Poppins" }}>
      <SidebarComponent currentPage="Mentor Log" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <HeaderComponent />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F5F6FA" }}>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 600, fontFamily: "Nunito Sans" }}
          >
            Mentor Logs
          </Typography>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{
                bgcolor: "#DDD",
                color: "#626262",
                fontSize: 14,
                textTransform: "none",
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
                "&:hover": { bgcolor: "#ccc" },
              }}
            >
              Download Excel File
            </Button>
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
                  onChange={handleSortChange}
                  sx={{ borderRadius: 4 }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        fontFamily: "Poppins",
                      },
                    },
                  }}
                >
                  {["Newest", "Oldest", "Name"].map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{
                        fontWeight: sortBy === option ? "600" : "400",
                        fontFamily: "Poppins",
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
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
                  placeholder="Search for logs..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      ml: 1,
                      fontSize: 14,
                      fontFamily: "Poppins",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, bgcolor: "#fff", fontFamily: "Poppins" }}
          >
            <Table sx={{ fontFamily: "Poppins" }}>
              <TableHead
                sx={{ backgroundColor: "#F0F0F0", fontFamily: "Poppins" }}
              >
                <TableRow sx={{ fontFamily: "Poppins" }}>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Mentor</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Student</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>
                    School Contact
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>School</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Date</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Start</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>End</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Hours</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>Activity</TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>
                    Meeting Circumstance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log, idx) => (
                  <TableRow key={idx} sx={{ fontFamily: "Poppins" }}>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.mentor_name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.student_name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.school_contact_name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.student_school}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {formatDate(log.date)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {formatTime(log.start_time)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {formatTime(log.end_time)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {roundHours(log.hours_logged)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.activity}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.meeting_circumstance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              bgcolor: "#fff",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontFamily: "Poppins",
            }}
          >
            <Typography fontSize={14} sx={{ fontFamily: "Poppins" }}>
              Showing data {startIndex + 1} to {endIndex} of {totalEntries}{" "}
              entries
            </Typography>
            <Pagination
              count={Math.ceil(totalEntries / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{
                fontFamily: "Poppins",
                "& .MuiPaginationItem-root": {
                  backgroundColor: "#F5F5F5",
                  fontFamily: "Poppins",
                },
                "& .MuiPaginationItem-previousNext": {
                  backgroundColor: "#F5F5F5",
                },
                "& .Mui-selected": {
                  backgroundColor: "#57C5CC !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MentorLogsPage;
