import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "@/utils/supabase";

function UserEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const [user_id, setID] = useState(user?.user_id || "");
  const [user_name, setName] = useState(user?.user_name || "");
  const [user_email, setEmail] = useState(user?.user_email || "");
  const [user_role, setRole] = useState(user?.user_role || "");
  const [user_department, setDepartment] = useState(
    user?.user_department || ""
  );

  async function saveData() {
    const login_time = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("users")
        .update([
          {
            user_id,
            user_name,
            user_email,
            user_role,
            user_department,
            login_time,
          },
        ])
        .eq("user_id", user_id);

      if (error) throw error;

      alert("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving user data: " + error.message);
    }
  }

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="round-box flex flex-col bg-white gap-4 p-4">
      <h1 className="text-center font-bold text-lg">Edit User</h1>
      <label htmlFor="userID">User ID</label>
      <input
        style={{ backgroundColor: "#e3e3e3" }}
        id="userID"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={user_id}
        type="text"
        onChange={(e) => setID(e.target.value)}
        disabled
      />

      <label htmlFor="userName">Name</label>
      <input
        id="userName"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={user_name}
        type="text"
        placeholder="Enter Name here"
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="userEmail">Email</label>
      <input
        id="userEmail"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={user_email}
        type="email"
        placeholder="Enter Email here"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="userRole">Role</label>
      <input
        id="userRole"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={user_role}
        type="text"
        placeholder="Enter User Role"
        onChange={(e) => setRole(e.target.value)}
      />

      <label htmlFor="userDepartment">Department</label>
      <input
        id="userDepartment"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={user_department}
        type="text"
        placeholder="Enter Department"
        onChange={(e) => setDepartment(e.target.value)}
      />

      <div className="flex flex-row justify-center gap-8 w-full">
        <button
          onClick={handleCancel}
          className="bg-gray-100 w-full text-center p-2 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={saveData}
          className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default UserEdit;
