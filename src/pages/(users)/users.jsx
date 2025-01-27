import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import UserEdit from "@/pages/(users)/userEdit"; // Import UserEdit component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for opening modal
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, website, mobile_number, email, user_role, user_department"
        );

      if (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users!");
      } else {
        setData(users || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Open the modal
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="flex flex-col mx-20 mt-6 gap-8">
      <div className="flex flex-row justify-between">
        <button
          onClick={() => navigate("/user_add")}
          className="bg-[#6EB229] text-white text-sm py-2 px-8 rounded-[50px]"
        >
          Add User
        </button>
      </div>

      <div className="round-box p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UserID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="border-solid border-2 border-[#2B32B2] py-1 w-28 text-center rounded-[50px] text-[#2B32B2] font-medium"
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
