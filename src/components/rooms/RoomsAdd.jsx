import { supabase } from '@/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function RoomsEdit() {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Assuming the room ID is passed via route params
    const [room_name, setRoomName] = useState("");
    const [room_type, setRoomType] = useState("");
    const [room_capacity, setRoomCapacity] = useState("");
    const [room_building, setRoomBuilding] = useState("");  
    const [room_image, setRoomImage] = useState("");
    const [originalImage, setOriginalImage] = useState(""); // To handle image changes

    useEffect(() => {
        // Fetch room details for the given roomId
        async function fetchRoomDetails() {
            try {
                const { data, error } = await supabase
                    .from("rooms")
                    .select("*")
                    .eq("id", roomId)
                    .single();

                if (error) throw error;

                setRoomName(data.room_name);
                setRoomType(data.room_type);
                setRoomCapacity(data.room_capacity);
                setRoomBuilding(data.room_building);
                setRoomImage(data.room_image);
                setOriginalImage(data.room_image);
            } catch (error) {
                console.error("Error fetching room details:", error);
                alert("Error fetching room details: " + error.message);
            }
        }

        fetchRoomDetails();
    }, [roomId]);

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
            const { data: publicUrlData } = await supabase.storage
                .from('Rooms')
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image: " + error.message);
            return null;
        }
    }

    async function updateData() {
        let finalImageUrl = room_image;

        // Upload new image if an image file was selected
        if (room_image !== originalImage && !room_image.startsWith("http")) {
            const uploadedImageUrl = await handleImageUpload();
            if (!uploadedImageUrl) return; // Stop if upload fails
            finalImageUrl = uploadedImageUrl;
        }

        try {
            const { data, error } = await supabase
                .from("rooms")
                .update({
                    room_name,
                    room_type,
                    room_capacity,
                    room_building,
                    room_image: finalImageUrl
                })
                .eq("id", roomId);

            if (error) throw error;

            alert("Data updated successfully");
            navigate("/rooms");
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Error updating data: " + error.message);
        }
    }

    return (
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1 className="text-center font-bold text-lg">Edit Room</h1>
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
            <label htmlFor="roomType">Room Description</label>
            <input
                id="roomType"
                className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm"
                value={room_type}
                type="text"
                placeholder="Enter room description here"
                onChange={(e) => setRoomType(e.target.value)}
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
                value={room_building}
                type="text"
                placeholder="Enter room location"
                onChange={(e) => setRoomBuilding(e.target.value)}
            />
            <div className="flex flex-row justify-center gap-8 w-full">
                <button onClick={() => navigate("/rooms")} className="bg-gray-100 w-full text-center p-2 rounded-md">
                    Cancel
                </button>
                <button onClick={updateData} className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md">
                    Update
                </button>
            </div>
        </div>
    );
}

export default RoomsEdit;
