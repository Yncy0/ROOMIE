import React, { useState } from "react";
import { Box, Button, Typography, Modal, TextField } from "@mui/material";
import supabase from "@/utils/supabase";

const AddUserModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    user_department: "",
    mobile_number: "",
    user_role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .insert({
          username: formData.username,
          full_name: formData.full_name,
          email: formData.email,
          user_department: formData.user_department,
          mobile_number: formData.mobile_number,
          user_role: formData.user_role,
        });

      if (error) throw error;

      alert("User added successfully");
      onClose(); // Close modal after successful insertion
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Error adding user: " + error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-user-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="add-user-modal-title" variant="h6" sx={{ mb: 2 }}>
          Add New User
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Department"
          name="user_department"
          value={formData.user_department}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mobile Number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Role"
          name="user_role"
          value={formData.user_role}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddUser}
            sx={{ mr: 2 }}
          >
            Add User
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
