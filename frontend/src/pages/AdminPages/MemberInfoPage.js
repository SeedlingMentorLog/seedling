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
import SidebarComponentAdmin from "../../components/SidebarComponentAdmin";
import HeaderComponent from "../../components/HeaderComponent";

const MemberInfoPage = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");
  const [page, setPage] = useState(1);

  // Verifying a user
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [editUserData, setEditUserData] = useState({ name: "", email: "" });
  const [roleChange, setRoleChange] = useState("");
  const [relationships, setRelationships] = useState([]);
  const [schoolContacts, setSchoolContacts] = useState([]);

  // Deleting a user
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const rowsPerPage = 10;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role.toLowerCase();
  const accessToken = currentUser?.accessToken;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/get/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        const schoolContactsData = data.users.filter(
          (user) => user.role === "school contact"
        );
        setUsers(data.users || []);
        setSchoolContacts(schoolContactsData || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = async (user) => {
    fetch(`${process.env.REACT_APP_BACKEND}/get/students/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRelationships(
          data.students.map((student) => ({
            contactId: student.school_contact_id,
            studentName: student.student_name,
            startDate: student.start_date,
            endDate: student.end_date,
            birthday: student.student_birthday,
            school: student.student_school,
            primaryId: student.mentor_to_student_id,
            notAdded: false,
          }))
        );
        setSelectedUser(user);
        setEditUserData({ name: user.name, email: user.email });
        setRoleChange(user.role);
        setOpenEditPopup(true);
      })
      .catch((err) => console.error("Failed to fetch school contacts", err));
  };

  const handleEditChange = (field, value) => {
    setEditUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRoleChange(newRole);
  };

  const handleAddRelationship = () => {
    setRelationships([
      ...relationships,
      {
        contactId: "",
        studentName: "",
        startDate: "",
        endDate: "",
        birthday: "",
        school: "",
        notAdded: true,
      },
    ]);
  };

  const handleDeleteRelationship = async (id) => {
    if (!id) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this relationship?"
    );
    if (!confirm) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/post/delete_relationship/${userRole}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ mentor_to_student_id: id }),
        }
      );

      if (response.ok) {
        // Update relationships state
        setRelationships((prev) => prev.filter((r) => r.primaryId !== id));
        setOpenEditPopup(false);
      } else {
        const data = await response.json();
        console.error(data.error || "Failed to delete relationship");
      }
    } catch (err) {
      console.error("Error deleting relationship:", err);
    }
  };

  const handleRelationshipChange = (index, field, value) => {
    const newRel = [...relationships];
    newRel[index][field] = value;
    setRelationships(newRel);
  };

  const handleEditSubmit = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND}/post/update_user_profile/${userRole}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: selectedUser.id,
            ...editUserData,
            role: roleChange,
          }),
        }
      );

      if (
        roleChange === "mentor" ||
        roleChange === "admin" ||
        roleChange === "staff"
      ) {
        for (const rel of relationships) {
          if (
            !rel.contactId ||
            !rel.studentName ||
            !rel.birthday ||
            !rel.school ||
            !rel.startDate
          )
            continue;

          // Add the new relationship
          if (rel.notAdded) {
            await fetch(
              `${process.env.REACT_APP_BACKEND}/post/add_mentor_to_student/${userRole}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  mentor_id: selectedUser.id,
                  school_contact_id: rel.contactId,
                  student_name: rel.studentName,
                  start_date: rel.startDate,
                  end_date: rel.endDate || null,
                  student_birthday: rel.birthday,
                  student_school: rel.school,
                }),
              }
            );
          } else {
            // Update the existing relationship
            await fetch(
              `${process.env.REACT_APP_BACKEND}/post/update_mentor_to_student/${userRole}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  relationship_id: rel.primaryId,
                  school_contact_id: rel.contactId,
                  student_name: rel.studentName,
                  start_date: rel.startDate.split("T")[0],
                  end_date: rel.endDate ? rel.endDate.split("T")[0] : null,
                  student_birthday: rel.birthday.split("T")[0],
                  student_school: rel.school,
                }),
              }
            );
          }
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, ...editUserData, role: roleChange }
            : u
        )
      );
      setOpenEditPopup(false);
    } catch (error) {
      console.error("Failed to update user or add relationships:", error);
    }
  };

  const handleClosePopup = () => {
    setOpenEditPopup(false);
    setOpenVerifyPopup(false);
    setSelectedUser(null);
    setSelectedRole("");
    setRelationships([]);
    setEditUserData({ name: "", email: "" });
    setRoleChange("");
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
      <SidebarComponentAdmin currentPage="Member Info" />
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
                  <TableCell>Update User</TableCell>
                  <TableCell>Delete User</TableCell>
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
                      {userRole === "admin" && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleEditClick(user)}
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
                          {user.verified ? "Modify" : "Verify"}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {userRole === "admin" && currentUser.id !== user.id && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setSelectedUserId(user.firebase_id);
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

          {/* Edit Dialog */}
          <Dialog
            open={openEditPopup}
            onClose={handleClosePopup}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={editUserData.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                sx={{
                  mt: 2,
                  "& .MuiInputBase-root": {
                    borderRadius: 4,
                    fontFamily: "Poppins",
                  },
                  "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                }}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="role-label" sx={{ fontFamily: "Poppins" }}>
                  Role
                </InputLabel>
                <Select
                  labelId="role-label"
                  value={roleChange}
                  label="Role"
                  onChange={handleRoleChange}
                  sx={{ borderRadius: 4, fontFamily: "Poppins" }}
                  MenuProps={{ PaperProps: { sx: { fontFamily: "Poppins" } } }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="school contact">School Contact</MenuItem>
                </Select>
              </FormControl>

              {/* Mentor-Specific Fields */}
              {(roleChange === "mentor" ||
                roleChange === "admin" ||
                roleChange === "staff") &&
                relationships.map((r, i) => (
                  <Box
                    key={i}
                    sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    <Typography
                      sx={{
                        marginTop: 2,
                        marginLeft: 1,
                        fontSize: 16,
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    >
                      Mentor-Student Relationship {i + 1}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        marginTop: 1.5,
                        bgcolor: "#57C5CC",
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: "Poppins",
                        fontWeight: 400,
                        borderRadius: 4,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#4aa7ad" },
                      }}
                      onClick={() => handleDeleteRelationship(r.primaryId)}
                    >
                      Delete
                    </Button>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontFamily: "Poppins" }}>
                        School Contact*
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
                        label="School Contact"
                        sx={{ borderRadius: 4, fontFamily: "Poppins" }}
                        MenuProps={{
                          PaperProps: { sx: { fontFamily: "Poppins" } },
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
                      label="Student Name*"
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
                        "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Start Date*"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={r.startDate ? r.startDate.split("T")[0] : ""}
                      onChange={(e) =>
                        handleRelationshipChange(i, "startDate", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={r.endDate ? r.endDate.split("T")[0] : ""}
                      onChange={(e) =>
                        handleRelationshipChange(i, "endDate", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Birthday*"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={r.birthday ? r.birthday.split("T")[0] : ""}
                      onChange={(e) =>
                        handleRelationshipChange(i, "birthday", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="School*"
                      value={r.school}
                      onChange={(e) =>
                        handleRelationshipChange(i, "school", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: 4,
                          fontFamily: "Poppins",
                        },
                        "& .MuiInputLabel-root": { fontFamily: "Poppins" },
                      }}
                    />
                  </Box>
                ))}

              {(roleChange === "mentor" ||
                roleChange === "admin" ||
                roleChange === "staff") && (
                <Button
                  onClick={handleAddRelationship}
                  sx={{
                    mt: 2,
                    bgcolor: "#DDD",
                    color: "#626262",
                    fontSize: 14,
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
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  borderRadius: 4,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
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
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user?
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
                      `${process.env.REACT_APP_BACKEND}/post/delete_user/${userRole}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ firebase_id: selectedUserId }),
                      }
                    );

                    if (response.ok) {
                      // Optional: refresh user list or give feedback
                      window.location.reload(); // or trigger re-fetch
                    } else {
                      const data = await response.json();
                      console.error(data.error || "Failed to delete user");
                    }
                  } catch (err) {
                    console.error("Error deleting user:", err);
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
    </Box>
  );
};

export default MemberInfoPage;
