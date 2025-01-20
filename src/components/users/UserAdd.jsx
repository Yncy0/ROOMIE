import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";

function UserAdd() {
  const navigate = useNavigate();
  const [user_name, setName] = useState("");
  const [user_email, setEmail] = useState("");
  const [user_role, setRole] = useState("");
  const [user_department, setDepartment] = useState("");

  async function saveData() {
    const login_time = new Date().toISOString();

    try {
      const { data, error } = await supabase.from("users").insert([
        {
          user_name,
          user_email,
          user_role,
          user_department,
          login_time,
        },
      ]);

      if (error) throw error;

      alert("User saved successfully");
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
      <h1 className="text-center font-bold text-lg">Create New User</h1>

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
          Create
        </button>
      </div>
    </div>
  );
}

export default UserAdd;
