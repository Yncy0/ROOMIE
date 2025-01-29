import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import supabase from "@/utils/supabase"; // Assuming Supabase client is set up

const ManageUser = ({
  id,
  username,
  full_name,
  avatar_url,
  website,
  mobile_number,
  email,
  user_role,
  user_department,
  onClose,
}) => {
  const [userData, setUserData] = useState({
    username,
    full_name,
    avatar_url,
    website,
    mobile_number,
    email,
    user_role,
    user_department,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Save Changes (Update user data in Supabase)
  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: userData.username,
          full_name: userData.full_name,
          email: userData.email,
          user_role: userData.user_role,
          user_department: userData.user_department,
          avatar_url: userData.avatar_url,
          website: userData.website,
          mobile_number: userData.mobile_number,
        })
        .eq("id", id);

      if (error) throw error;

      alert("User updated successfully");
      onClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
  };

  // Handle Delete User
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("User deleted successfully");
      onClose(); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user: " + error.message);
    }
  };

  return (
    <Box>
      <TextField
        label="ID"
        fullWidth
        value={id}
        sx={{ mb: 2 }}
        disabled
      />
      <TextField
        label="Username"
        fullWidth
        value={username}
        name="username"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />
      <TextField
        label="Full Name"
        fullWidth
        value={userData.full_name}
        name="full_name"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />
      <TextField
        label="Department"
        fullWidth
        value={userData.user_department}
        name="user_department"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />
      <TextField
        label="Email"
        fullWidth
        value={userData.email}
        name="email"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />
      <TextField
        label="Contact"
        fullWidth
        value={userData.mobile_number}
        name="mobile_number"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />
      <TextField
        label="User Role"
        fullWidth
        value={userData.user_role}
        name="user_role"
        sx={{ mb: 2 }}
        onChange={handleInputChange}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" color="success" onClick={handleEdit}>
          Save Changes
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete User
        </Button>
      </Box>
    </Box>
  );
};

export default ManageUser;
