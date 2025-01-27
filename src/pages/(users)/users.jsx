import React, { useState, useEffect, useMemo } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LucideFilter } from "lucide-react";
import supabase from "@/utils/supabase";
import "@/components/ui/loader.css";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft as ChevronsLeftIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFetchUsers } from "@/hooks/queries/users/useFetchUsers";

export default function UsersPage() {
  // const { data, error } = useFetchUsers();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // New state
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State to hold users from the database
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Controls filter modal
  const [filters, setFilters] = useState({
    role: "",
    department: "",
    sortField: "name", // Default sorting by name
    sortOrder: "asc", // Default sorting order is ascending
  });
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  //Fetching
  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_archived", false);

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Fetched users:", users); // Log fetched users
        setUsers(users || []); // Ensure users are set to the state
        setData(users || []); // Set data as well
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to call fetch on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Add User
  const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      user_role: "",
      user_department: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({
        username: "",
        email: "",
        user_role: "",
        user_department: "",
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div
          className="bg-white p-6 rounded-xl shadow-lg"
          style={{
            width: "90%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
          }}
        >
          <h2 className="text-lg font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            />
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              name="user_department"
              value={formData.user_department}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CITE">CITE</option>
              <option value="CBEA">CBEA</option>
              <option value="CAMP">CAMP</option>
              <option value="CASE">CASE</option>
              <option value="CITHM">CITHM</option>
            </select>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#1f2947] text-white px-4 py-2 rounded-md hover:bg-[#1f2947]"
                onClick={handleSubmit}
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const handleAddUserSubmit = async (newUser) => {
    try {
      const { data, error } = await supabase.from("profiles").insert([newUser]);

      if (error) {
        console.error("Error adding user:", error);
      } else {
        console.log("User added successfully:", data);
        fetchUsers(); // Refresh data
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Edit User
  const EditUserModal = ({ isOpen, onClose, onSubmit, user }) => {
    const [formData, setFormData] = useState({
      username: user?.username || "",
      email: user?.email || "",
      user_role: user?.user_role || "",
      user_department: user?.user_department || "",
    });

    useEffect(() => {
      if (user) {
        setFormData({
          username: user.username,
          email: user.email,
          user_role: user.user_role,
          user_department: user.user_department,
        });
      }
    }, [user]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { username, email, user_role, user_department } = formData;
      const user_id = user?.user_id; // Ensure user_id is from the passed user object

      if (!user_id) {
        alert("User ID is missing.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profile")
          .update({ username, email, user_role, user_department })
          .eq("id", user_id); // Use the correct user_id here

        if (error) {
          console.error("Error updating user:", error);
          throw error;
        }

        console.log("User updated:", data);
        alert("User updated successfully");

        // Refresh the page after successful update
        window.location.reload();
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving user data: " + error.message);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div
          className="bg-white p-6 rounded-xl shadow-lg"
          style={{ maxWidth: "500px" }}
        >
          <h2 className="text-lg font-bold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            />
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              name="user_department"
              value={formData.user_department}
              onChange={handleChange}
              required
              className="input-field border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CITE">CITE</option>
              <option value="CBEA">CBEA</option>
              <option value="CAMP">CAMP</option>
              <option value="CASE">CASE</option>
              <option value="CITHM">CITHM</option>
            </select>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };
  const handleEditUserSubmit = async (updatedUser) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("user_id", updatedUser.user_id);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        console.log("User updated successfully:", data);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Delete Modal
  const ConfirmModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-bold">
          Are you sure you want to delete this user?
        </h2>
        <div className="flex justify-around mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
  const handleDelete = async () => {
    if (!userIdToDelete) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .update({ is_archived: true })
        .eq("user_id", userIdToDelete);

      if (error) {
        throw new Error(error.message);
      }

      console.log("User archived successfully:", data);

      setData((prevData) =>
        prevData.filter((user) => user.user_id !== userIdToDelete)
      );

      navigate("/archieves");

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error archiving user:", err.message);
    }
  };
  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setIsModalOpen(true);
  };

  //Filter
  const applyFilters = () => {
    console.log("Applying filters:", filters);
    console.log("All users:", users);

    // Apply filter conditions
    const filteredUsers = users
      .filter((user) => {
        const matchesRole = filters.role
          ? user.user_role === filters.role
          : true;
        const matchesDepartment = filters.department
          ? user.user_department === filters.department
          : true;
        return matchesRole && matchesDepartment;
      })
      .sort((a, b) => {
        if (filters.sortField === "name") {
          if (filters.sortOrder === "asc") {
            return a.username.localeCompare(b.username);
          } else {
            return b.username.localeCompare(a.username);
          }
        }
        if (filters.sortField === "role") {
          if (filters.sortOrder === "asc") {
            return a.user_role.localeCompare(b.user_role);
          } else {
            return b.user_role.localeCompare(a.user_role);
          }
        }
        if (filters.sortField === "department") {
          if (filters.sortOrder === "asc") {
            return a.user_department.localeCompare(b.user_department);
          } else {
            return b.user_department.localeCompare(a.user_department);
          }
        }
        return 0;
      });

    // Debug log filtered data
    console.log("Filtered users:", filteredUsers);

    // Update data state with filtered users
    if (filteredUsers.length === 0) {
      console.log("No users match the filter criteria.");
    }
    setData(filteredUsers); // Set filtered data to state
    setIsFilterOpen(false); // Close filter modal
  };
  const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const resetFilters = (event) => {
    event.preventDefault(); // Prevents the default form behavior

    // Reset filters
    setFilters({
      role: "",
      department: "",
      sortField: "name",
      sortOrder: "asc",
    });

    // Optionally, reapply the filters to show the unfiltered table
    // For example, you can reset the data or trigger a re-fetch of the users:
    fetchUsers(); // If you want to refresh the users data after resetting the filters
  };
  const [buttonPosition, setButtonPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
  });
  const handleFilterButtonClick = (event) => {
    const rect = event.target.getBoundingClientRect(); // Get the button's position
    setButtonPosition({
      top: rect.top,
      left: rect.left,
      height: rect.height,
    });
    toggleFilterModal(); // Toggle the modal
  };

  //search
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const username = user.username?.[0].toLowerCase() || "";
      const email = user.email?.[0].toLowerCase() || "";
      const userRole = user.user_role?.[0].toLowerCase() || "";
      const userDepartment = user.user_department?.[0].toLowerCase() || "";
      const searchQueryFirstLetter = searchQuery[0]?.toLowerCase() || ""; // First letter of the search query

      return (
        username.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        userRole.includes(searchQuery.toLowerCase()) ||
        userDepartment.includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, data]);

  //Table Column Contents
  const columns = React.useMemo(
    () => [
      { header: "UserID", accessorKey: "id" },
      { header: "Name", accessorKey: "username" },
      { header: "Email", accessorKey: "email" },
      { header: "Role", accessorKey: "user_role" },
      { header: "Department", accessorKey: "user_department" },
      { header: "Last Login", accessorKey: "login_time" },
      {
        header: "Edit User",
        accessorKey: "edit_user",
        cell: ({ row }) => (
          <button
            onClick={(event) => {
              event.stopPropagation();
              openEditModal(row.original);
            }}
            className="border-solid border-2 border-[#2B32B2] py-1 w-28 text-center rounded-[50px]
           text-[#2B32B2] font-medium"
          >
            Edit
          </button>
        ),
      },
      {
        header: "Delete User",
        accessorKey: "deleteUser",
        cell: ({ row }) => {
          const userId = row.original.user_id;
          return (
            <button
              className="border-solid border-2 border-red-500 py-1 w-28 text-center rounded-[50px]
               text-red-500 font-medium"
              onClick={(event) => {
                event.stopPropagation();
                openDeleteModal(userId);
              }}
            >
              Delete
            </button>
          );
        },
      },
    ],
    [data][filteredData]
  );

  //Pagination
  const table = useReactTable({
    data: searchQuery ? filteredData : data, // Use filteredData if searchQuery exists, else use original data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Show 5 rows per page
      },
    },
  });

  //Loading Spinner
  if (loading) {
    return (
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-4 sm:mx-6 md:mx-20 mt-6 gap-8">
      {/*Filter, Search and Add Button*/}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start sm:gap-4">
        {/*Filter and Search Button*/}
        <div className="flex gap-4 w-full items-center sm:w-auto">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            className="input-search min-w-[400px] bg-transparent border-2 
          border-gray-300 text-gray-500 rounded-lg p-2"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
          <button
            onClick={handleFilterButtonClick} // Trigger positioning on click
            className="flex flex-row items-center gap-2 px-4 py-2 
          border-solid border-[#E6E6E6] border-2 bg-white rounded-lg 
          text-base w-auto h-auto"
          >
            <LucideFilter width={"16px"} />
            Filter
          </button>
        </div>

        {/*Add User*/}
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center justify-center text-[#35487a] bg-transparent border-2 border-solid 
          border-[#35487a] rounded-lg py-2 px-8 text-sm font-medium cursor-pointer transition-colors duration-300 
          hover:bg-[#35487a] hover:text-white mt-4"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            Add User
          </span>
        </button>
      </div>

      {/*Nothing to edit here*/}
      <div className="round-box p-6 overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/*Pagination*/}
        <div className="flex flex-row justify-end items-center py-4 px-14 gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded ${
              !table.getCanPreviousPage() ? "text-gray-400" : "text-[#35487a]"
            }`}
          >
            <ChevronsLeftIcon />
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded ${
              !table.getCanPreviousPage() ? "text-gray-400" : "text-[#35487a]"
            }`}
          >
            <ChevronLeft />
          </button>

          <span className="font-bold font-roboto px-4 text-[#35487a]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded ${
              !table.getCanNextPage() ? "text-gray-400" : "text-[#35487a]"
            }`}
          >
            <ChevronRight />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded ${
              !table.getCanNextPage() ? "text-gray-400" : "text-[#35487a]"
            }`}
          >
            <ChevronsRight />
          </button>
        </div>
      </div>

      {/*Modals*/}
      {isModalOpen && (
        <ConfirmModal
          onConfirm={() => handleDelete(userIdToDelete)}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUserSubmit}
        />
      )}

      {isEditUserModalOpen && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={() => setIsEditUserModalOpen(false)}
          onSubmit={handleEditUserSubmit}
          user={userToEdit}
        />
      )}

      {isFilterOpen && (
        <div
          className="absolute bg-white shadow-lg p-4 rounded-md w-[300px] transition-all duration-300 ease-in-out"
          style={{
            top: `${buttonPosition.top + buttonPosition.height + 10}px`, // Position below the button
            left: `${buttonPosition.left}px`, // Align with the left of the button
          }}
        >
          <h3 className="text-lg font-semibold mb-3">Filter Users</h3>
          <div className="flex flex-col gap-3">
            {/* Filter Form */}
            <label>
              Sort by:
              <select
                name="sortField"
                value={filters.sortField}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              >
                <option value="name">Name</option>
                <option value="role">Role</option>
                <option value="department">Department</option>
              </select>
            </label>

            <label>
              Order:
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="border p-2 rounded w-full"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>

            <div className="flex justify-between mt-4">
              <button
                onClick={resetFilters}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Reset
              </button>
              <button
                onClick={applyFilters} // Apply filters
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
