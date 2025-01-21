import React, { useState } from "react";
import { useUpdateBuilding } from "@/hooks/queries/building/useUpdateBuilding";
import { useUpdateRooms } from "@/hooks/queries/rooms/useUpdateRooms";
import { useLocation, useNavigate } from "react-router";

export default function RoomsEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    id,
    room_image,
    room_name: initialRoomName,
    room_location: initialRoomLocation,
    room_capacity: initialRoomCapacity,
    room_type: initialRoomType,
    building_id,
  } = state;

  const [roomName, setRoomName] = useState(initialRoomName);
  const [roomLocation, setRoomLocation] = useState(initialRoomLocation);
  const [roomCapacity, setRoomCapacity] = useState(initialRoomCapacity);
  const [roomType, setRoomType] = useState(initialRoomType);

  const updateRooms = useUpdateRooms(
    id,
    roomName,
    room_image,
    roomType,
    roomCapacity,
    building_id
  );

  const updateBuilding = useUpdateBuilding(roomLocation);

  const onHandleUpdate = async () => {
    try {
      if (updateRooms && updateBuilding) {
        await updateRooms();
        await updateBuilding();
        alert("Data saved successfully");
        navigate("/rooms");
      }
    } catch (error) {
      console.error("Update failed: ", error);
      alert("An error occurred while saving the data. Please try again.");
    }
  };

  return (
    <div className="round-box flex flex-col bg-white gap-4 p-4">
      <h1>Edit Room</h1>
      <img
        src={room_image ? room_image : "src/assets/dummy/image-placeholder.png"}
        alt=""
      />
      <label htmlFor="roomName">Room Name</label>
      <input
        id="roomName"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
      />
      <label htmlFor="roomType">Room Type</label>
      <input
        id="roomType"
        className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm"
        type="text"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        placeholder="Enter room type"
      />
      <label htmlFor="roomCapacity">Room Capacity</label>
      <input
        id="roomCapacity"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        value={roomCapacity}
        onChange={(e) => setRoomCapacity(e.target.value)}
        placeholder="Enter room capacity"
      />
      <label htmlFor="roomLocation">Room Location/Building</label>
      <input
        id="roomLocation"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        value={roomLocation}
        onChange={(e) => setRoomLocation(e.target.value)}
        placeholder="Enter room location"
      />
      <div className="flex flex-row justify-center gap-8">
        <button
          onClick={() => navigate("/rooms")}
          className="bg-gray-100 w-full text-center p-2 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onHandleUpdate}
          className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
