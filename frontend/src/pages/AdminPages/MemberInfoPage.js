import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
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
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SidebarComponent from "../../components/SidebarComponent";
import HeaderComponent from "../../components/HeaderComponent";

const MemberInfoPage = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");
  const [page, setPage] = useState(1);
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [schoolContacts, setSchoolContacts] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const rowsPerPage = 10;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role.toLowerCase();

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

  const handleVerifyClick = (user) => {
    setSelectedUser(user);
    setOpenVerifyPopup(true);
  };

  const handleClosePopup = () => {
    setOpenVerifyPopup(false);
    setSelectedUser(null);
    setSelectedRole("");
    setRelationships([]);
  };

  useEffect(() => {
    if (selectedRole === "mentor" && userRole) {
      fetch(`${process.env.REACT_APP_BACKEND}/get/school_contacts/${userRole}`)
        .then((res) => res.json())
        .then((data) => {
          setSchoolContacts(data.school_contacts || []);
        })
        .catch((err) => console.error("Failed to fetch school contacts", err));
    }
  }, [selectedRole, userRole]);

  const handleAddRelationship = () => {
    setRelationships([
      ...relationships,
      { contactId: "", studentName: "", birthday: "", school: "" },
    ]);
  };

  const handleRelationshipChange = (index, field, value) => {
    const newRelationships = [...relationships];
    newRelationships[index][field] = value;
    setRelationships(newRelationships);
  };

  const handleVerifyUserSubmit = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND}/post/verify_user/${userRole}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedUser.id, role: selectedRole }),
        }
      );

      if (selectedRole === "mentor") {
        for (const rel of relationships) {
          if (
            !rel.contactId ||
            !rel.studentName ||
            !rel.birthday ||
            !rel.school
          ) {
            continue; // Skip if any field is empty
          }
          await fetch(
            `${process.env.REACT_APP_BACKEND}/post/add_mentor_to_student/${userRole}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mentor_id: selectedUser.id,
                school_contact_id: rel.contactId,
                student_name: rel.studentName,
                student_birthday: rel.birthday,
                student_school: rel.school,
              }),
            }
          );
        }
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, verified: true, role: selectedRole }
            : user
        )
      );

      handleClosePopup();
    } catch (error) {
      console.error("Error verifying user or adding relationships:", error);
    }
  };

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
    .filter((u) => u.name.toLowerCase().includes(searchValue.toLowerCase()))
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

          {/* Action Bar */}
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
                  <MenuItem
                    value="A-Z"
                    sx={{ fontWeight: sortBy === "A-Z" ? 600 : 400 }}
                  >
                    A - Z
                  </MenuItem>
                  <MenuItem
                    value="Z-A"
                    sx={{ fontWeight: sortBy === "Z-A" ? 600 : 400 }}
                  >
                    Z - A
                  </MenuItem>
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
            <Table>
              <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Verification</TableCell>
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
                    <TableCell>
                      {user.verified ? (
                        ""
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleVerifyClick(user)}
                          sx={{
                            bgcolor: "#57C5CC",
                            color: "#FFFFFF",
                            fontSize: 14,
                            textTransform: "none",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            borderRadius: 4,
                            "&:hover": { bgcolor: "#4aa7ad" },
                          }}
                        >
                          Verify user
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
            }}
          >
            <Typography fontSize={14}>
              Showing data {start + 1} to {end} of {total} entries
            </Typography>
            <Pagination
              count={Math.ceil(total / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": { backgroundColor: "#F5F5F5" },
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

          {/* Verification Popup */}
          <Dialog
            open={openVerifyPopup}
            onClose={handleClosePopup}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Verify User</DialogTitle>
            <DialogContent>
              {/* Role Selector */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel
                  id="role-select-label"
                  sx={{ fontFamily: "Poppins" }}
                >
                  Assign Role
                </InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  label="Assign Role"
                  sx={{ borderRadius: 4, fontFamily: "Poppins" }}
                  MenuProps={{
                    PaperProps: {
                      sx: { fontFamily: "Poppins" },
                    },
                  }}
                >
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="school contact">School Contact</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>

              {/* Mentor Relationships */}
              {selectedRole === "mentor" &&
                relationships.map((r, i) => (
                  <Box
                    key={i}
                    sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontFamily: "Poppins" }}>
                        School Contact
                      </InputLabel>
                      <Select
                        value={r.contactId}
                        onChange={(e) =>
                          handleRelationshipChange(
                            i,
                            "contactId",
                            e.target.value
                          )
                        }
                        label="Assign Contact"
                        sx={{ borderRadius: 4, fontFamily: "Poppins" }}
                        MenuProps={{
                          PaperProps: {
                            sx: { fontFamily: "Poppins" },
                          },
                        }}
                      >
                        {schoolContacts.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Student Name"
                      value={r.studentName}
                      onChange={(e) =>
                        handleRelationshipChange(
                          i,
                          "studentName",
                          e.target.value
                        )
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: "Poppins",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Birthday"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={r.birthday}
                      onChange={(e) =>
                        handleRelationshipChange(i, "birthday", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: "Poppins",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="School"
                      value={r.school}
                      onChange={(e) =>
                        handleRelationshipChange(i, "school", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: "Poppins",
                        },
                      }}
                    />
                  </Box>
                ))}

              {selectedRole === "mentor" && (
                <Button
                  onClick={handleAddRelationship}
                  sx={{
                    mt: 2,
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
                  + Add Another Student
                </Button>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClosePopup}
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
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#57C5CC",
                  color: "#fff",
                  fontSize: 14,
                  textTransform: "none",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  borderRadius: 4,
                  "&:hover": { bgcolor: "#4aa7ad" },
                }}
                onClick={handleVerifyUserSubmit}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default MemberInfoPage;
