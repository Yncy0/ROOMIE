// Import required modules
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../../supabaseConfig";

// UserInfoSched Component
function UserInfoSched({ userInfo, bookedRooms, onAddBookedRoom }) {
    return (
        <div className="flex flex-col md:flex-row gap-6 mx-10 mt-6">
            {/* User Info Card */}
            <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">User Information</h2>
                <table className="w-full border-collapse border border-gray-200 text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2">ID</th>
                            <th className="border border-gray-200 px-4 py-2">Full Name</th>
                            <th className="border border-gray-200 px-4 py-2">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{userInfo?.user_id}</td>
                            <td className="border border-gray-200 px-4 py-2">{userInfo?.user_name}</td>
                            <td className="border border-gray-200 px-4 py-2">{userInfo?.user_department}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Booked Room Card */}
            <div className="flex-1 bg-white shadow-md rounded-lg p-6 relative">
                <h2 className="text-xl font-bold mb-4">Booked Rooms</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded absolute top-6 right-6"
                    onClick={onAddBookedRoom}
                >
                    Add Booked Room
                </button>
                <table className="w-full border-collapse border border-gray-200 text-left mt-10">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2">Room Name</th>
                            <th className="border border-gray-200 px-4 py-2">Subject Code</th>
                            <th className="border border-gray-200 px-4 py-2">Class</th>
                            <th className="border border-gray-200 px-4 py-2">Time In</th>
                            <th className="border border-gray-200 px-4 py-2">Time Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookedRooms.length > 0 ? (
                            bookedRooms.map((room, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-200 px-4 py-2">{room.room_name}</td>
                                    <td className="border border-gray-200 px-4 py-2">{room.subject_code}</td>
                                    <td className="border border-gray-200 px-4 py-2">{room.section}</td>
                                    <td className="border border-gray-200 px-4 py-2">{room.time_in}</td>
                                    <td className="border border-gray-200 px-4 py-2">{room.time_out}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border border-gray-200 px-4 py-2 text-center" colSpan="5">
                                    No rooms booked
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// AddBookedRoomModal Component
function AddBookedRoomModal({ userId, onClose, onSuccess }) {
    const [roomName, setRoomName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [section, setSection] = useState("");
    const [timeIn, setTimeIn] = useState("");
    const [timeOut, setTimeOut] = useState("");
    const [date, setDate] = useState(""); // Date input to combine with time

    const handleAddRoom = async () => {
        try {
            // Validate inputs
            if (!roomName || !subjectCode || !section || !timeIn || !timeOut || !date) {
                alert("All fields are required.");
                return;
            }

            // Format timestamps correctly (combine date and time)
            const formattedTimeIn = `${date}T${timeIn}:00`;
            const formattedTimeOut = `${date}T${timeOut}:00`;

            // Insert into Supabase table
            const { data, error } = await supabase
                .from("booking")
                .insert([
                    {
                        user_id: userId,
                        room_id: roomsId,
                        subject_code: subjectCode,
                        section: section,
                        time_in: formattedTimeIn,  // Directly use time_in (timestamp)
                        time_out: formattedTimeOut,  // Directly use time_out (timestamp)
                    },
                ]);

            if (error) {
                console.error("Supabase insert error:", error);
                alert(`Failed to add room: ${error.message}`);
                return;
            }

            alert("Room successfully booked!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Booked Room</h2>
                <div className="mb-4">
                    <label className="block mb-1">Room Name</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Subject Code</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Section</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Date</label>
                    <input
                        type="date"
                        className="border rounded px-3 py-2 w-full"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Time In</label>
                    <input
                        type="time"
                        className="border rounded px-3 py-2 w-full"
                        value={timeIn}
                        onChange={(e) => setTimeIn(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Time Out</label>
                    <input
                        type="time"
                        className="border rounded px-3 py-2 w-full"
                        value={timeOut}
                        onChange={(e) => setTimeOut(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddRoom}
                    >
                        Add Room
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Component
function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [bookedRooms, setBookedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfoAndRooms = async () => {
            const user = location.state?.user;

            if (!user) {
                navigate("/");
                return;
            }

            try {
                setLoading(true);

                const { data: userInfo } = await supabase
                    .from("users")
                    .select("user_id, user_name, user_department")
                    .eq("user_id", user.user_id)
                    .single();

                setUserInfo(userInfo);

                const { data: bookedRooms } = await supabase
                    .from("booking")
                    .select("room_id, subject_code, section, time_in, time_out")
                    .eq("user_id", user.user_id);

                setBookedRooms(bookedRooms || []);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfoAndRooms();
    }, [location.state?.user, navigate]);

    const handleAddRoomSuccess = async () => {
        try {
            const { data: updatedRooms, error } = await supabase
                .from("booking")
                .select("room_id, subject_code, section, time_in, time_out")
                .eq("user_id", userInfo.user_id);

            if (error) throw error;
            setBookedRooms(updatedRooms || []);
        } catch (error) {
            console.error("Error refreshing booked rooms:", error.message);
        }
        setShowModal(false);
    };

    if (loading) return <div className="text-center mt-6">Loading...</div>;
    if (!userInfo) return <div className="text-center mt-6">User not found.</div>;

    return (
        <div className="App bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">User Information and Schedule</h1>
            <UserInfoSched
                userInfo={userInfo}
                bookedRooms={bookedRooms}
                onAddBookedRoom={() => setShowModal(true)}
            />
            {showModal && (
                <AddBookedRoomModal
                    userId={userInfo.user_id}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleAddRoomSuccess}
                />
            )}
        </div>
    );
}

export default App;
