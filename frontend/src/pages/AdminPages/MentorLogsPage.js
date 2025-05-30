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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import SidebarComponentAdmin from "../../components/SidebarComponentAdmin";
import HeaderComponent from "../../components/HeaderComponent";
import { saveAs } from "file-saver";

const MentorLogsPage = () => {
  const rowsPerPage = 10;
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [mentorLogs, setMentorLogs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "mentor_name",
    "student_name",
    "school_contact_name",
    "student_school",
    "date",
    "start_time",
    "end_time",
    "hours_logged",
    "activity",
    "meeting_circumstance",
  ]);

  // Deleting a log
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const allColumns = [
    { key: "mentor_name", label: "Mentor" },
    { key: "student_name", label: "Student" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "school_contact_name", label: "School Contact" },
    { key: "student_school", label: "School" },
    { key: "date", label: "Date" },
    { key: "start_time", label: "Start Time" },
    { key: "end_time", label: "End Time" },
    { key: "hours_logged", label: "Hours" },
    { key: "activity", label: "Activity" },
    { key: "meeting_circumstance", label: "Meeting Circumstance" },
    { key: "comments", label: "Comments" },
  ];

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role.toLowerCase();
  const accessToken = currentUser?.accessToken;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/get/mentor_logs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`; // prefix with apostrophe
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
    .filter((log) => {
      const logDate = log.date ? new Date(log.date) : null;
      const start = startDateFilter ? new Date(startDateFilter) : null;
      const end = endDateFilter ? new Date(endDateFilter) : null;

      if (start && logDate < start) return false;
      if (end && logDate > end) return false;
      return true;
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

  const handleColumnToggle = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const generatePreviewData = () => {
    const previewRows = filteredLogs.slice(0, 5).map((log) =>
      selectedColumns.map((key) => {
        let val = log[key];
        if (key === "date" || key === "start_date" || key === "end_date")
          val = val ? formatDate(val) : "";
        else if (key === "start_time" || key === "end_time")
          val = val ? formatTime(val) : "";
        else if (key === "hours_logged") val = val ? roundHours(val) : "";
        return val ?? "";
      })
    );
    setCsvPreviewData(previewRows);
    setDownloadDialogOpen(false);
    setPreviewOpen(true);
  };

  const handleDownload = () => {
    const csvHeader = selectedColumns
      .map((key) => {
        const col = allColumns.find((c) => c.key === key);
        return `"${col?.label || key}"`;
      })
      .join(",");

    const csvRows = filteredLogs.map((log) =>
      selectedColumns
        .map((key) => {
          let val = log[key];
          if (key === "date" || key === "start_date" || key === "end_date")
            val = val ? formatDate(val) : "";
          else if (key === "start_time" || key === "end_time")
            val = val ? formatTime(val) : "";
          else if (key === "hours_logged") val = val ? roundHours(val) : "";
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const blob = new Blob([csvHeader + "\n" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    let filename = "mentor_logs";

    if (startDateFilter || endDateFilter) {
      const format = (dateStr) => {
        if (!dateStr) return "any";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      };

      const start = format(startDateFilter);
      const end = format(endDateFilter);
      filename += `_${start}_to_${end}`;
    }

    filename += ".csv";

    saveAs(blob, filename);

    setPreviewOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", fontFamily: "Poppins" }}>
      <SidebarComponentAdmin currentPage="Mentor Logs" />
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
              onClick={() => setDownloadDialogOpen(true)}
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

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDateFilter || ""}
              onChange={(e) => setStartDateFilter(e.target.value)}
              sx={{ fontFamily: "Poppins" }}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDateFilter || ""}
              onChange={(e) => setEndDateFilter(e.target.value)}
              sx={{ fontFamily: "Poppins" }}
            />
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
                    Start Date
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Poppins" }}>End Date</TableCell>
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
                  <TableCell sx={{ fontFamily: "Poppins" }}>Delete</TableCell>
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
                      {formatDate(log.start_date)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.end_date ? formatDate(log.end_date) : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.school_contact_name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.student_school}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.date ? formatDate(log.date) : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.start_time ? formatTime(log.start_time) : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.end_time ? formatTime(log.end_time) : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.hours_logged ? roundHours(log.hours_logged) : ""}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.activity}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {log.meeting_circumstance}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins" }}>
                      {userRole === "admin" && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setSelectedLogId(log.id);
                            setOpenDeleteDialog(true);
                          }}
                          sx={{
                            bgcolor: "#57C5CC",
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            borderRadius: 4,
                            textTransform: "none",
                            "&:hover": { bgcolor: "#4aa7ad" },
                          }}
                        >
                          Delete
                        </Button>
                      )}
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
        <Dialog
          open={downloadDialogOpen}
          onClose={() => setDownloadDialogOpen(false)}
        >
          <DialogTitle sx={{ fontFamily: "Poppins" }}>
            Select Columns to Export
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: 2, mb: 2, pt: 1 }}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDateFilter || ""}
                onChange={(e) => setStartDateFilter(e.target.value)}
                fullWidth
                sx={{ fontFamily: "Poppins" }}
              />
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDateFilter || ""}
                onChange={(e) => setEndDateFilter(e.target.value)}
                fullWidth
                sx={{ fontFamily: "Poppins" }}
              />
            </Box>

            <FormGroup>
              {allColumns.map((col) => (
                <FormControlLabel
                  key={col.key}
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(col.key)}
                      onChange={() => handleColumnToggle(col.key)}
                      sx={{
                        color: "#57C5CC",
                        "&.Mui-checked": {
                          color: "#57C5CC",
                        },
                      }}
                    />
                  }
                  label={col.label}
                  sx={{ fontFamily: "Poppins" }}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDownloadDialogOpen(false)}
              sx={{
                bgcolor: "#DDD",
                color: "#626262",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={generatePreviewData}
              variant="contained"
              sx={{
                bgcolor: "#57C5CC",
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
                "&:hover": { bgcolor: "#4aa7ad" },
              }}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: "Poppins" }}>CSV Preview</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead
                  sx={{ backgroundColor: "#F0F0F0", fontFamily: "Poppins" }}
                >
                  <TableRow>
                    {selectedColumns.map((key) => {
                      const label =
                        allColumns.find((c) => c.key === key)?.label || key;
                      return (
                        <TableCell
                          key={key}
                          sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
                        >
                          {label}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvPreviewData.map((row, idx) => (
                    <TableRow key={idx}>
                      {row.map((val, i) => (
                        <TableCell key={i} sx={{ fontFamily: "Poppins" }}>
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPreviewOpen(false)}
              sx={{
                bgcolor: "#DDD",
                color: "#626262",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
              }}
            >
              Back
            </Button>
            <Button
              onClick={handleDownload}
              variant="contained"
              sx={{
                bgcolor: "#57C5CC",
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
                "&:hover": { bgcolor: "#4aa7ad" },
              }}
            >
              Download CSV
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete log dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this log?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                bgcolor: "#DDD",
                color: "#626262",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${process.env.REACT_APP_BACKEND}/post/delete_log/${userRole}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                      body: JSON.stringify({ id: selectedLogId }),
                    }
                  );

                  if (response.ok) {
                    // Optional: refresh log list or give feedback
                    window.location.reload(); // or trigger re-fetch
                  } else {
                    const data = await response.json();
                    console.error(data.error || "Failed to delete log");
                  }
                } catch (err) {
                  console.error("Error deleting log:", err);
                } finally {
                  setOpenDeleteDialog(false);
                }
              }}
              color="error"
              variant="contained"
              sx={{
                bgcolor: "#57C5CC",
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins",
                fontWeight: 400,
                borderRadius: 4,
                "&:hover": { bgcolor: "#4aa7ad" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MentorLogsPage;
