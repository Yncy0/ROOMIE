import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import supabase from "../../supabaseConfig";
import { v4 as uuidv4 } from 'uuid';

function RoomsAdd() {
    const navigate = useNavigate();
    const [room_name, setRoomName] = useState("");
    const [room_type, setRoomType] = useState("");
    const [room_capacity, setRoomCapacity] = useState("");
    const [room_building, setRoomBuilding] = useState("");
    const [close, setClose] = useState(false);
    const [room_image, setRoomImage] = useState("");

    async function handleImageUpload() {
        try {
            const fileInput = document.getElementById("imageInput");
            if (fileInput.files.length === 0) {
                alert("Please select an image file.");
                return null;
            }

            const file = fileInput.files[0];
            const filePath = `rooms/${uuidv4()}_${file.name}`;
            const { data, error } = await supabase.storage
                .from("Rooms")
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL of the uploaded image
            const { data: publicUrlData } = supabase.storage
                .from('Rooms')
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image: " + error.message);
            return null;
        }
    }

    async function saveData() {
        let finalImageUrl = room_image;

        // Upload image if an image file was selected
        if (!room_image.startsWith("http")) {
            const uploadedImageUrl = await handleImageUpload();
            if (!uploadedImageUrl) return; // Stop if upload fails
            finalImageUrl = uploadedImageUrl;
        }

        try {
            const { data, error } = await supabase
                .from("rooms")
                .insert([{
                    room_name,
                    room_type,
                    room_capacity,
                    room_location,
                    room_image: finalImageUrl
                }]);

            if (error) throw error;

            alert("Data saved successfully");
            navigate("/rooms");
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error saving data: " + error.message);
        }
    }

    return (
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1 className="text-center font-bold text-lg">Create New Room</h1>
            <div className="flex justify-center">
                <img 
                    src={room_image ? room_image : "src/assets/dummy/image-placeholder.png"} 
                    alt="Room Preview" 
                    className="object-cover w-64" 
                />
            </div>
            {/* Image File Input */}
            <label htmlFor="imageInput">Upload Image</label>
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={(e) => setRoomImage(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : "")}
                className="border-2 border-gray-300 p-2 rounded-md"
            />
            <label htmlFor="roomName">Room Name</label>
            <input
                id="roomName"
                className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
                value={room_name}
                type="text"
                placeholder="Enter room name here"
                onChange={(e) => setRoomName(e.target.value)}
            />
            <label htmlFor="roomDescription">Room Description</label>
            <input
                id="roomDescription"
                className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm"
                value={room_description}
                type="text"
                placeholder="Enter room description here"
                onChange={(e) => setRoomDescription(e.target.value)}
            />
            <label htmlFor="roomCapacity">Room Capacity</label>
            <input
                id="roomCapacity"
                className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
                value={room_capacity}
                type="text"
                placeholder="Enter room capacity"
                onChange={(e) => setRoomCapacity(e.target.value)}
            />
            <label htmlFor="roomLocation">Room Location/Building</label>
            <input
                id="roomLocation"
                className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
                value={room_location}
                type="text"
                placeholder="Enter room location"
                onChange={(e) => setRoomLocation(e.target.value)}
            />
            <div className="flex flex-row justify-center gap-8 w-full">
                <button onClick={() => setClose(!close)} className="bg-gray-100 w-full text-center p-2 rounded-md">
                    Cancel
                </button>
                {close && <Navigate to="/rooms" />}
                <button onClick={saveData} className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md">
                    Create
                </button>
            </div>
        </div>
    );
}

export default RoomsAdd;
