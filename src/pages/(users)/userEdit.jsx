import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";

function Modal({ isOpen, onClose, user }) {
  const [id, setID] = useState("");
  const [username, setUsername] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [user_role, setUserRole] = useState("");
  const [user_department, setDepartment] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [mobile_number, setMobileNumber] = useState("");

  useEffect(() => {
    if (user) {
      setID(user.id);
      setUsername(user.username);
      setFullName(user.full_name);
      setEmail(user.email);
      setUserRole(user.user_role);
      setDepartment(user.user_department);
      setAvatarUrl(user.avatar_url);
      setWebsite(user.website);
      setMobileNumber(user.mobile_number);
    }
  }, [user]);

  async function saveData() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name,
          email,
          user_role,
          user_department,
          avatar_url,
          website,
          mobile_number,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      alert("User updated successfully");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving user data: " + error.message);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h1 className="text-center font-bold text-lg">Edit User</h1>

        <label htmlFor="userID">User ID</label>
        <input
          id="userID"
          className="bg-gray-200 border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={id}
          type="text"
          disabled
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={username}
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={full_name}
          type="text"
          placeholder="Enter full name"
          onChange={(e) => setFullName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={email}
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="userRole">Role</label>
        <input
          id="userRole"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={user_role}
          type="text"
          placeholder="Enter user role"
          onChange={(e) => setUserRole(e.target.value)}
        />

        <label htmlFor="department">Department</label>
        <input
          id="user_department"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={user_department}
          type="text"
          placeholder="Enter department"
          onChange={(e) => setDepartment(e.target.value)}
        />

        <label htmlFor="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={avatar_url}
          type="text"
          placeholder="Enter avatar URL"
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <label htmlFor="website">Website</label>
        <input
          id="website"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={website}
          type="text"
          placeholder="Enter website"
          onChange={(e) => setWebsite(e.target.value)}
        />

        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          id="mobileNumber"
          className="bg-none border-2 border-gray-300 p-2 rounded-md text-sm w-full mb-2"
          value={mobile_number}
          type="text"
          placeholder="Enter mobile number"
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-white w-1/2 p-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={saveData}
            className="bg-blue-600 text-white w-1/2 p-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
